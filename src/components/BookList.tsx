/** @jsx jsx */
import { jsx } from "theme-ui";
import * as React from "react";
import { BookData, LaneData } from "opds-web-client/lib/interfaces";
import BookCover from "./BookCover";
import truncateString from "../utils/truncate";
import {
  getAuthors,
  getFulfillmentState,
  availabilityString
} from "../utils/book";
import Lane from "./Lane";
import Link from "./Link";
import DetailField from "./BookMetaDetail";
import useBorrow from "../hooks/useBorrow";
import Button, { NavButton } from "./Button";
import LoadingIndicator from "./LoadingIndicator";
import useInfiniteScroll from "../hooks/useInfiniteScroll";
import { H2, Text } from "./Text";
import { Image, Card } from "@nypl/design-system-react-components";
import MediumIndicator from "components/MediumIndicator";
import { ArrowForward } from "icons";

/**
 * In a collection you can:
 *  - See lanes view
 *  - See List/Gallery view
 *    - Switch between list and gallery in this case
 */

const ListLoadingIndicator = () => (
  <div
    sx={{
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      fontSize: 2,
      fontWeight: "heading",
      p: 3
    }}
  >
    <LoadingIndicator /> Loading more books...
  </div>
);

export const ListView: React.FC<{
  books: BookData[];
  breadcrumb?: React.ReactNode;
}> = ({ books }) => {
  // this hook will refetch the page when we reach the bottom of the screen
  const { listRef, isFetchingPage } = useInfiniteScroll();

  return (
    <React.Fragment>
      <ul ref={listRef} sx={{ px: 5 }} data-testid="listview-list">
        {books.map(book => (
          <BookListItem key={book.id} book={book} />
        ))}
      </ul>
      {isFetchingPage && <ListLoadingIndicator />}
    </React.Fragment>
  );
};

const BookListItem: React.FC<{ book: BookData }> = ({ book }) => {
  // if there is no book url, it doesn't make sense to display it.
  if (!book.url) return null;
  return (
    <li
      sx={{
        listStyle: "none"
      }}
      aria-label={`Book: ${book.title}`}
    >
      <Card
        sx={{ bg: "ui.white" }}
        image={
          book.imageUrl ? <Image src={book.imageUrl} isDecorative /> : undefined
        }
        ctas={
          <div
            sx={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              height: "100%",
              textAlign: "center"
            }}
          >
            <BookListCTA book={book} />
          </div>
        }
      >
        <H2 sx={{ mb: 0 }}>{book.title}</H2>
        {book.subtitle && (
          <Text variant="callouts.italic">{book.subtitle}</Text>
        )}
        by <Text sx={{ color: "brand.secondary" }}>{getAuthors(book)}</Text>
        <MediumIndicator book={book} />
        <div sx={{ mt: 3 }}>
          <Text
            variant="text.body.italic"
            dangerouslySetInnerHTML={{
              __html: truncateString(book.summary ?? "", 200)
            }}
          ></Text>
        </div>
      </Card>
    </li>
  );
};

const BookListCTA: React.FC<{ book: BookData }> = ({ book }) => {
  const fulfillmentState = getFulfillmentState(book);
  const { borrowOrReserve, isLoading } = useBorrow(book);

  switch (fulfillmentState) {
    case "OPEN_ACCESS":
      return (
        <>
          <NavButton
            variant="ghost"
            bookUrl={book.url ?? ""}
            iconRight={ArrowForward}
          >
            View Book
          </NavButton>
          <Text
            variant="text.body.italic"
            sx={{ fontSize: "-1", color: "ui.gray.dark", mt: 1 }}
          >
            This open-access book is available to keep.
          </Text>
        </>
      );

    case "AVAILABLE_TO_BORROW":
      return (
        <>
          <Button
            onClick={borrowOrReserve}
            color="ui.black"
            loading={isLoading}
            loadingText="Borrowing..."
          >
            Borrow
          </Button>
          <Text
            variant="text.body.italic"
            sx={{ fontSize: "-1", color: "ui.gray.dark", my: 1 }}
          >
            {availabilityString(book)}
          </Text>
          <NavButton
            variant="ghost"
            bookUrl={book.url ?? ""}
            iconRight={ArrowForward}
          >
            View Book Details
          </NavButton>
        </>
      );

    case "AVAILABLE_TO_RESERVE":
      return (
        <>
          <Button
            onClick={borrowOrReserve}
            color="ui.black"
            loading={isLoading}
            loadingText="Reserving..."
          >
            Reserve
          </Button>
          <Text
            variant="text.body.italic"
            sx={{ fontSize: "-1", color: "ui.gray.dark", my: 1 }}
          >
            {availabilityString(book)}
          </Text>
          <NavButton
            variant="ghost"
            bookUrl={book.url ?? ""}
            iconRight={ArrowForward}
          >
            View Book Details
          </NavButton>
        </>
      );

    case "RESERVED": {
      const position = book.holds?.position;
      console.log(position, typeof position);
      return (
        <>
          <Button disabled color="ui.black">
            Reserved
          </Button>
          <Text
            variant="text.body.italic"
            sx={{ fontSize: "-1", color: "ui.gray.dark", my: 1 }}
          >
            You have this book on hold.{" "}
            {typeof position === "number" &&
              !isNaN(position) &&
              `Position: ${position}`}
          </Text>
          <NavButton
            variant="ghost"
            bookUrl={book.url ?? ""}
            iconRight={ArrowForward}
          >
            View Book Details
          </NavButton>
        </>
      );
    }

    case "READY_TO_BORROW": {
      return (
        <>
          <Button
            onClick={borrowOrReserve}
            color="ui.black"
            loading={isLoading}
            loadingText="Borrowing..."
          >
            Borrow
          </Button>
          <Text
            variant="text.body.italic"
            sx={{ fontSize: "-1", color: "ui.gray.dark", my: 1 }}
          >
            You can now borrow this book!
          </Text>
          <NavButton
            variant="ghost"
            bookUrl={book.url ?? ""}
            iconRight={ArrowForward}
          >
            View Book Details
          </NavButton>
        </>
      );
    }

    case "AVAILABLE_TO_ACCESS": {
      const availableUntil = book.availability?.until
        ? new Date(book.availability.until).toDateString()
        : "NaN";

      const subtitle =
        availableUntil !== "NaN"
          ? `You have this book on loan until ${availableUntil}.`
          : "You have this book on loan.";

      return (
        <>
          <Text
            variant="text.body.italic"
            sx={{ fontSize: "-1", color: "ui.gray.dark", my: 1 }}
          >
            {subtitle}
          </Text>
          <NavButton
            variant="ghost"
            bookUrl={book.url ?? ""}
            iconRight={ArrowForward}
          >
            View Book Details
          </NavButton>
        </>
      );
    }

    case "FULFILLMENT_STATE_ERROR":
      return (
        <NavButton
          variant="ghost"
          bookUrl={book.url ?? ""}
          iconRight={ArrowForward}
        >
          View Book Details
        </NavButton>
      );

    default:
      return null;
  }
};

export const LanesView: React.FC<{ lanes: LaneData[] }> = ({ lanes }) => {
  return (
    <React.Fragment>
      {lanes.map(lane => (
        <Lane key={lane.url} lane={lane} />
      ))}
    </React.Fragment>
  );
};
