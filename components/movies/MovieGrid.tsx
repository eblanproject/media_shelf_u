"use client"


// type Movie = {
//     id: string;
//     title: string;
// };
//  type MovieProps = {
//      movies: Movie[];
// }

export default function MovieGrid() {

     const moviesProps = [
         {
             id:"1",
             title: "Movie 1"
         },
         {
             id:"2",
             title: "Movie 2"
         },
         {
             id:"3",
             title: "Movie 3"
         },
         {
             id:"4",
             title: "Movie 4"
         },
         {
             id:"5",
             title: "Movie 5"
         },
         {
             id:"6",
             title: "Movie 6"
         },
         {
             id:"7",
             title: "Movie 7"
         },
         {
             id:"8",
             title: "Movie 8"
         },
         {
             id:"9",
             title: "Movie 9"
         },
         {
             id:"10",
             title: "Movie 10"
         },
         {
             id:"11",
             title: "Movie 11"
         },
         {
             id:"12",
             title: "Movie 12"
         },
         {
             id:"13",
             title: "Movie 13"
         },
         {
             id:"14",
             title: "Movie 14"
         },
     ]

    return (
            <div className="flex w-full flex-col px-4 sm:px-6">
                <h2 className="mt-10 text-center text-lg font-bold text-gray-400">Catalog</h2>
                <div className="grid w-full max-w-screen-2xl self-center grid-cols-2 justify-items-center gap-x-4
                gap-y-6 mt-4 mb-40 sm:grid-cols-3 sm:gap-x-6 sm:gap-y-8 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-7">

                    {/* Render your movie items here
                    {movies.map((movie) => (
                        <div key={movie.id} className="flex flex-col items-center gap-2">
                            <div className="w-32 h-48 bg-gray-700 rounded-md"></div>
                            <h3 className="text-sm text-gray-400">{movie.title}</h3>
                        </div>
                    ))}
                    */}

                    {moviesProps.map((movie) => (
                        <div key={movie.id} className="flex w-full max-w-[11rem] flex-col items-center transition hover:scale-105">
                            <div
                                className="w-full aspect-[2/3] cursor-pointer rounded-md bg-gray-700 bg-cover bg-center transition hover:brightness-75"
                                style={{
                                    backgroundImage: `url(https://picsum.photos/seed/msu-movie-${movie.id}/352/512)`,
                                }}
                            />                            <h3 className="text-sm text-gray-400">{movie.title}</h3>
                        </div>
                    ))}

                </div>
            </div>
    )
}
