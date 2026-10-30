"use client"




export default function SettingsPage() {


    const BottonProps = [
            {
                title:"profile",
            },
            {
                title:"account",
            },
            {
                title:"notifications",
            },
            {
                title:"privacy",
            },
        ]


    return (

     <section className="flex flex-col p-4 mx-auto justify-start  ">

      <h1 className="text-3xl font-bold">Settings</h1>
      <p className="mt-2 text-gray-400">Account and appearance settings will appear here.</p>



         <div className="flex flex-row gap-6 mt-6  px-3 ">
            {BottonProps.map((botton) => (
                <div key={botton.title}
                     className="cursor-pointer "
                >
                    <h2 className="text-xs font-semibold">{botton.title}</h2>
                </div>
            ))}
         </div>





             <form className="flex flex-col p-5 gap-4 mt-5 border border-gray-900">

                 <div className="flex flex-row gap-4">

                     <div className="flex w-15 h-15   rounded-full shrink-0 bg-cover bg-center"
                          style={{
                              backgroundImage:
                                  "url(https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&h=200&fit=crop&auto=format)",
                          }}>
                     </div>

                 <label htmlFor="Username" className="block  text-xs text-gray-300 font-semibold  mb-2">
                     Username
                 </label>
                 <input
                     type="email"
                     id="email"
                     className="w-full h-1/2 px-3 py-2 border border-gray-700 bg-gray-900 text-white rounded outline-none focus:border-yellow-300 focus:ring-1 focus:ring-yellow-300"
                     required
                 />
                 </div>

                 <div className="mb-4">
                     <label htmlFor="password" className="block text-xs text-gray-300 font-semibold mb-2">
                         Password
                     </label>
                     <input
                         type="password"
                         id="password"
                         className="w-full px-3 py-2 border border-gray-700 bg-gray-900  rounded outline-none placeholder:text-gray-500 focus:border-yellow-300 focus:ring-1 focus:ring-yellow-300"
                         required
                     />
                 </div>


             </form>


                <button className="no-wrap bg-yellow-400 w-50 py-2 ">
                    Save changes
                </button>


    </section>
  );
}
