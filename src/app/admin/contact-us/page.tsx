"use client";

import { useEffect, useState } from "react";

export default function ContactUsAdminPage() {

    const [data, setData] = useState([]);
    const [loader, setLoader] = useState(false);

    const submitForm = () => {
        setLoader(true);
        fetch("/api/admin/contact-us")
            .then(res => res.json())
            .then(res => {
                if (res.success) {
                    setData(res.data);
                }
                setLoader(false);
            });
    }
    useEffect(() => {
        submitForm();
    }, []);

    return (
        <div className="p-6 text-black">
            <div className="mb-6 flex items-center justify-between">
                <h1 className="text-2xl font-bold mb-4">
                    Contact Requests
                </h1>
                <button className="px-4 py-2 bg-[#81BA45] text-white rounded-lg" onClick={() => submitForm()}>
                    {loader ? "Loading..." : "Refresh"}
                </button>
            </div>

            <div className="overflow-auto border rounded-lg">
                <table className="w-full">

                    <thead>
                        <tr className="bg-[#a8d578]">
                            <th className="p-3 text-left">Name</th>
                            <th className="p-3 text-left">Email</th>
                            <th className="p-3 text-left">Phone</th>
                            <th className="p-3 text-left">Message</th>
                            <th className="p-3 text-left">Date</th>
                        </tr>
                    </thead>

                    <tbody>
                        {loader ? (
                            <tr>
                                <td colSpan={5} className="p-3 text-center">
                                    Loading...
                                </td>
                            </tr>
                        ) : (
                            <>
                                {
                                    data.map((item: any) => (
                                        <tr key={item.ContactID}>
                                            <td className="p-3">
                                                {item.FirstName} {item.LastName}
                                            </td>

                                            <td className="p-3">
                                                {item.Email}
                                            </td>

                                            <td className="p-3">
                                                {item.Phone}
                                            </td>

                                            <td className="p-3 max-w-[400px]">
                                                {item.Message}
                                            </td>

                                            <td className="p-3">
                                                {new Date(item.CreatedDate)
                                                    .toLocaleString("en-IN")}
                                            </td>
                                        </tr>

                                    ))
                                }
                            </>
                        )}
                    </tbody>

                </table>
            </div>
        </div>
    );
}