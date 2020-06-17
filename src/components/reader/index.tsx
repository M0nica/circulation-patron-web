import React from "react";
import reader from "./util";
import useTypedSelector from "../../hooks/useTypedSelector";
import { SetCollectionAndBook } from "../../interfaces";
import useSetCollectionAndBook from "../../hooks/useSetCollectionAndBook";
import useNormalizedBook from "../../hooks/useNormalizedBook";
import { PageLoader } from "../LoadingIndicator";

export interface BookDetailsPropsNew {
  setCollectionAndBook: SetCollectionAndBook;
}

const BookPage: React.FC<BookDetailsPropsNew> = ({ setCollectionAndBook }) => {
  // set the collection and book
  useSetCollectionAndBook(setCollectionAndBook);

  const book = useNormalizedBook();

  const error = useTypedSelector(state => state.book.error);

  if (error) {
    return <p>whoops something went wrong {error}</p>;
  }

  if (!book) return <PageLoader />;

  const bookManifestUrl = `${book}/manifest.json`;

  if (typeof window !== "undefined") {
    reader(bookManifestUrl);
  }

  return (
    <>
      <div id="viewer" />{" "}
    </>
  );
};

export default BookPage;
