import React from "react";
import { AppProps } from "next/app";
import ContextProvider from "../components/context/ContextProvider";
import {
  SHORTEN_URLS,
  IS_SERVER,
  IS_DEVELOPMENT,
  REACT_AXE
} from "../utils/env";
import getPathFor from "../utils/getPathFor";
import UrlShortener from "../UrlShortener";
import getLibraryData, { setLibraryData } from "../dataflow/getLibraryData";
import getOrCreateStore from "../dataflow/getOrCreateStore";
import { LibraryData } from "../interfaces";
import { State } from "opds-web-client/lib/state";
import { ThemeProvider } from "theme-ui";
import theme from "../theme";
import Auth from "../components/Auth";
import Layout from "../components/Layout";
import ErrorBoundary from "../components/ErrorBoundary";
import Head from "next/head";
import Error from "next/error";
import { ParsedUrlQuery } from "querystring";
import libData from "../utils/libData";

type NotFoundProps = {
  statusCode: number;
};

type InitialData = {
  library: LibraryData;
  initialState: State;
};

type MyAppProps = InitialData | NotFoundProps;

function is404(props: MyAppProps): props is NotFoundProps {
  return !!(props as NotFoundProps).statusCode;
}

const MyApp = (props: MyAppProps & AppProps) => {
  /**
   * If there was no library or initialState provided, render the error page
   */
  if (is404(props)) {
    return <Error statusCode={props.statusCode} />;
  }

  const { library, initialState, Component, pageProps } = props;

  const urlShortener = new UrlShortener(library.catalogUrl, SHORTEN_URLS);
  const pathFor = getPathFor(urlShortener, library.id);
  const store = getOrCreateStore(pathFor, initialState);
  setLibraryData(library);
  return (
    <ErrorBoundary fallback={AppErrorFallback}>
      <Head>
        {/* define the default title */}
        <title>Library.catalogName</title>
      </Head>
      <ContextProvider
        shortenUrls={SHORTEN_URLS}
        library={library}
        store={store}
      >
        <ThemeProvider theme={theme}>
          <Auth>
            <Component {...pageProps} />
          </Auth>
        </ThemeProvider>
      </ContextProvider>
    </ErrorBoundary>
  );
};

/**
 * The query object type doesn't protect against undefined values, and
 * the "library" variable could be an array if you pass ?library=xxx&library=zzz
 * so this is essentially a typeguard for a situation that shouldn't happen.
 */
const getLibraryFromQuery = (
  query: ParsedUrlQuery | undefined
): string | undefined => {
  const libraryQuery: string | string[] | undefined = query?.library;
  return libraryQuery
    ? typeof libraryQuery === "string"
      ? libraryQuery
      : libraryQuery[0]
    : undefined;
};

MyApp.getInitialProps = async ({ ctx, err }) => {
  IS_SERVER
    ? console.log("Running _app getInitialProps on server")
    : console.log("Running _app getInitialProps on client");
  const { query } = ctx;

  /**
   * Get libraryData from the DataCache, which we will then set
   * in the redux store. We need to augment this for settings
   *  CONFIG_FILE
   *  LIBRARY_REGISTRY
   */
  const parsedLibrary = getLibraryFromQuery(query);
  const libraryData = await getLibraryData(parsedLibrary);

  if (!libraryData) return { statusCode: 404 };

  /**
   * Create the resources we need to complete a server render
   */
  const urlShortener = new UrlShortener(libraryData.catalogUrl, SHORTEN_URLS);
  const pathFor = getPathFor(urlShortener, libraryData.id);
  const store = getOrCreateStore(pathFor);

  /**
   * Pass updated redux state to the app component to be used to rebuild
   * the store on client side with pre-filled data from ssr
   */
  const initialState = store.getState();

  return {
    initialState,
    SHORTEN_URLS,
    pathFor,
    library: libraryData
  };
};

/**
 * Accessibility tool - outputs to devtools console on dev only and client-side only.
 * @see https://github.com/dequelabs/react-axe
 */
if (IS_DEVELOPMENT && !IS_SERVER && REACT_AXE) {
  const ReactDOM = require("react-dom");
  const axe = require("react-axe");
  axe(React, ReactDOM, 1000);
}

const AppErrorFallback: React.FC<{ message: string }> = ({ message }) => {
  return (
    <div>
      <p sx={{ textAlign: "center" }}>{message}</p>
    </div>
  );
};

export default MyApp;
