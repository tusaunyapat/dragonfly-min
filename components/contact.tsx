"use client";
import { useEffect, useState } from "react";
import { contacts } from "@/app/type";
import { selectContact } from "@/app/shelf/action";

export default function Contact() {
  const [contacts, setContacts] = useState<contacts[]>([]);

  useEffect(() => {
    const fetchContact = async () => {
      const contactsData = await selectContact();
      setContacts(contactsData); // Set the fetched data
    };

    fetchContact();
  }, []);

  return (
    <div className="flex flex-col">
      <h6 className="footer-title">ติดต่อแอดมิน</h6>
      <div className="flex flex-col gap-2">
        {contacts.map((contact, index) => (
          <div key={index} className="grid grid-cols-3">
            <p className="col-span-1 font-bold">{contact.name}</p>
            <p className="col-span-1">{contact.phone}</p>
            <p className="col-span-1">{contact.other}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
