"use client";
import { useEffect, useState } from "react";
import { social_medias } from "@/app/type";
import { selectSocialMedias } from "@/app/shelf/action";

export default function SocialMedia() {
  const [socialMedia, setSocialMedia] = useState<social_medias[]>([]);

  useEffect(() => {
    const fetchContact = async () => {
      const socialMediaData = await selectSocialMedias();
      setSocialMedia(socialMediaData); // Set the fetched data
    };

    fetchContact();
  }, []);

  return (
    <div className="flex flex-col">
      <h6 className="footer-title">ช่องทางอื่น ๆ</h6>
      <div className="flex flex-col gap-2">
        {socialMedia.map((socialmedia, index) => (
          <a key={index} href={socialmedia.url}>
            <p className="hover:text-warning">{socialmedia.platform}</p>
          </a>
        ))}
      </div>
    </div>
  );
}
