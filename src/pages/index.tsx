import { NextPage } from "next";
import Collection from "../components/Collection";
import SingleLibraryPage from "../components/SingleLibraryPage";
const Home: NextPage = () => {
  return (
    <SingleLibraryPage>
      <Collection />
    </SingleLibraryPage>
  );
};

export default Home;
