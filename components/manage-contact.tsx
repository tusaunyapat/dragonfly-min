"use client";
import Swal from "sweetalert2";
import { useEffect, useState } from "react";
import { MdModeEdit } from "react-icons/md";
import { RxCross1 } from "react-icons/rx";
import {
  addNewContact,
  selectContact,
  updateContact,
  deleteContact,
} from "@/app/shelf/action";
import { contacts } from "@/app/type";

export default function ManageContacts({ contacts }: { contacts: contacts[] }) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [other, setOther] = useState("");
  const [contactList, setContactList] = useState(contacts);
  const [isChange, setIsChange] = useState(false);
  const [updateName, setUpdateName] = useState("");
  const [updatePhone, setUpdatePhone] = useState("");
  const [updateOther, setUpdateOther] = useState("");
  const [collapseState, setCollapseState] = useState<{
    [key: string]: boolean;
  }>({});

  useEffect(() => {
    const fetchContacts = async () => {
      const contactsFromServer = await selectContact();
      setContactList(contactsFromServer);
    };
    fetchContacts();
  }, [isChange]);

  const handleAddNewContact = () => {
    const formData = new FormData();
    setIsChange(true);

    formData.append("name", name);
    formData.append("phone", phone);
    formData.append("other", other);

    Swal.fire({
      title: "Are you sure?",
      text: "You can delete it later!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, add it!",
      customClass: {
        popup: "w-10/12 md:w-3/5 lg:w-2/5", // Apply Tailwind directly
      },
    }).then(async (result) => {
      if (result.isConfirmed) {
        await addNewContact(formData);
        setName("");
        setPhone("");
        setOther("");
        setIsChange(false);
        Swal.fire({
          title: "Added!",
          text: "Contact has been added.",
          icon: "success",
          customClass: {
            popup: "w-10/12 md:w-3/5 lg:w-2/5", // Adjust the width here
          },
        });
      }
    });
  };

  const handleDeleteContact = (id: string) => {
    setIsChange(true);
    const formData = new FormData();
    formData.append("id", id);

    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
      customClass: {
        popup: "w-10/12 md:w-3/5 lg:w-2/5", // Apply Tailwind directly
      },
    }).then(async (result) => {
      if (result.isConfirmed) {
        await deleteContact(formData);
        setIsChange(false);
        Swal.fire({
          title: "Deleted!",
          text: "Contact has been deleted.",
          icon: "success",
          customClass: {
            popup: "w-10/12 md:w-3/5 lg:w-2/5", // Adjust the width here
          },
        });
      }
    });
  };

  const handleUpdateContact = (id: string) => {
    const formData = new FormData();
    setIsChange(true);

    formData.append("id", id);
    formData.append("name", updateName);
    formData.append("phone", updatePhone);
    formData.append("other", updateOther);
    //end formData
    Swal.fire({
      title: "Are you sure?",
      text: "You can update it later!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, update it!",
      customClass: {
        popup: "w-10/12 md:w-3/5 lg:w-2/5", // Apply Tailwind directly
      },
    }).then(async (result) => {
      if (result.isConfirmed) {
        await updateContact(formData);
        setUpdateName("");
        setUpdatePhone("");
        setUpdateOther("");
        setIsChange(false);
        setCollapseState((prev) => ({ ...prev, [id]: false }));
        Swal.fire({
          title: "Updated!",
          text: "Contact has been updated.",
          icon: "success",
          customClass: {
            popup: "w-10/12 md:w-3/5 lg:w-2/5", // Adjust the width here
          },
        });
      }
    });
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-10 w-10/12">
      <div className="rounded-lg shadow-md p-4">
        <p className="textsm lg:text-xl font-bold mb-4">
          ข้อมูลติดต่อที่มีอยู่
        </p>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {contactList.map((contact) => (
            <div
              key={contact.id}
              className="border rounded-lg bg-white w-full relative flex flex-col justify-between"
            >
              <div className="join join-vertical w-full">
                {/* Name + Buttons (Horizontal Row) */}
                <div className="flex justify-between items-center join join-item bg-slate-200 ">
                  <h3 className="text-md lg:text-lg font-semibold join-item px-2 ">
                    {contact.name}
                  </h3>
                  <div className="flex  join-item">
                    <button
                      className="btn btn-error btn-sm border-none bg-opacity-20 join-item"
                      onClick={() => handleDeleteContact(contact.id)}
                    >
                      <RxCross1 />
                    </button>
                    <button
                      className="btn btn-warning btn-sm border-none bg-opacity-20 join-item"
                      onClick={() => {
                        setUpdateName(contact.name ?? "");
                        setUpdatePhone(contact.phone ?? "");
                        setUpdateOther(contact.other ?? "");
                        setCollapseState((prev) => ({
                          ...prev,
                          [contact.id]: true,
                        }));
                      }}
                    >
                      <MdModeEdit />
                    </button>
                  </div>
                </div>

                {/* Phone & Other Info (Stacked Vertically) */}
                <div className="join join-vertical w-full bg-white  rounded-b-lg p-2">
                  <p className="text-sm lg:text-md join-item  py-1 ">
                    {contact.phone}
                  </p>
                  <p className="text-sm lg:text-base join-item overflow-auto">
                    {contact.other}
                  </p>
                </div>
              </div>

              {collapseState[contact.id] && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                  <div className="bg-white p-6 rounded-lg shadow-lg w-4/5 lg:w-96">
                    <h2 className="text-md lg:text-xl font-bold mb-3">
                      แก้ไขข้อมูล
                    </h2>
                    <input
                      type="text"
                      value={updateName}
                      placeholder="New name"
                      onChange={(e) => setUpdateName(e.target.value)}
                      className="input input-bordered input-warning w-full"
                    />
                    <input
                      type="text"
                      value={updatePhone}
                      placeholder="New phone number"
                      onChange={(e) => setUpdatePhone(e.target.value)}
                      className="input input-bordered input-warning w-full mt-2"
                    />
                    <input
                      type="text"
                      value={updateOther}
                      placeholder="Other details"
                      onChange={(e) => setUpdateOther(e.target.value)}
                      className="input input-bordered input-warning w-full mt-2"
                    />
                    <div className="flex justify-end mt-4 gap-3">
                      <button
                        className="px-2 py-1 lg:px-4 lg:py-2 text-sm bg-gray-300 rounded"
                        onClick={() =>
                          setCollapseState((prev) => ({
                            ...prev,
                            [contact.id]: false,
                          }))
                        }
                      >
                        ยกเลิก
                      </button>
                      <button
                        className="px-2 py-1 lg:px-4 lg:py-2 text-sm bg-yellow-500 text-white rounded"
                        onClick={() => handleUpdateContact(contact.id)}
                      >
                        แก้ไข
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="flex flex-col p-6 bg-warning bg-opacity-10 rounded-lg shadow-md">
        <p className="text-md lg:text-xl font-bold mb-4">
          เพิ่มข้อมูลติดต่อใหม่
        </p>
        <input
          type="text"
          value={name || ""}
          placeholder="Name"
          onChange={(e) => setName(e.target.value)}
          className="input input-bordered input-warning w-full"
        />
        <input
          type="text"
          value={phone || ""}
          placeholder="Phone"
          onChange={(e) => setPhone(e.target.value)}
          className="input input-bordered input-warning w-full mt-2"
        />
        <input
          type="text"
          value={other || ""}
          placeholder="Other details"
          onChange={(e) => setOther(e.target.value)}
          className="input input-bordered input-warning w-full mt-2"
        />
        <button
          className="btn btn-outline btn-warning mt-3"
          onClick={handleAddNewContact}
        >
          เพิ่มข้อมูลติดต่อ
        </button>
      </div>
    </div>
  );
}
