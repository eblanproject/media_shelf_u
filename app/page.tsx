import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";
import TeaserMovie from "@/components/movies/TeaserMovie";
import MovieGrid from "@/components/movies/MovieGrid";



export default function Home() {
  return (
    <div className="flex flex-col flex-1 items-center justify-center bg-zinc-50 font-sans dark:bg-black">


        <Header/>

        <TeaserMovie />

        <main className="flex w-full flex-1">

            <MovieGrid />

      </main>
        <Footer />
    </div>
  );
}
