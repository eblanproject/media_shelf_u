"use client";


export default function FavoritesPage() {
  return (
    <div className="mx-auto w-full max-w-7xl px-6 py-10">
      <h1 className="text-3xl font-bold text-center">Watchlist</h1>


        <div className="flex flex-col w-full bg-gray-900 rounded-lg p-6 mt-6 border border-gray-700">

            {/*movie card*/}

            <div className="flex w-full h-auto  ">


                {/*image*/}

                <div className="flex bg-red-50 w-20 h-30 rounded-xl justify-center">

                </div>

                {/*Description*/}

                    <div className="flex flex-row justify-between w-full">

                <div className="flex flex-col gap-2 p-4 w-100 h-auto justify-center">

                    <h3 className="text-xl font-bold ">
                        Blade Runner 2049
                    </h3>
                    <p>
                        2026  · Denis Villene
                    </p>

                </div>

                <p className="flex text-xl text-gray-500 h-full items-center right-0">
                    7.0
                </p>
                    </div>





            </div>



        </div>


    </div>
  );
}
