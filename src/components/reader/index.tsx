import React from "react";
import reader from "./util";
import useTypedSelector from "../../hooks/useTypedSelector";

const BookPage = () => {
  const book = useTypedSelector(state => state.book.data);
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
