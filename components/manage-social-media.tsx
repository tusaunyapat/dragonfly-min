"use client";
import Swal from "sweetalert2";
import { useEffect, useState } from "react";
import { MdModeEdit } from "react-icons/md";
import { RxCross1 } from "react-icons/rx";
import {
  addNewSocialMedia,
  updateSocialMedia,
  deleteSocialMedia,
  selectSocialMedias,
} from "@/app/shelf/action";
import { social_medias } from "@/app/type";

export default function ManageSocialMedia({
  socialMedias,
}: {
  socialMedias: social_medias[];
}) {
  const [platform, setPlatform] = useState("");
  const [url, setUrl] = useState("");
  const [socialMediaList, setSocialMediaList] = useState(socialMedias);
  const [isChange, setIsChange] = useState(false);
  const [updatePlatform, setUpdatePlatform] = useState("");
  const [updateUrl, setUpdateUrl] = useState("");
  const [collapseState, setCollapseState] = useState<{
    [key: string]: boolean;
  }>({});

  useEffect(() => {
    const fetchSocialMedias = async () => {
      const socialMediasFromServer = await selectSocialMedias();
      setSocialMediaList(socialMediasFromServer);
    };
    fetchSocialMedias();
  }, [isChange]);

  const handleAddNewSocialMedia = () => {
    const formData = new FormData();
    setIsChange(true);

    formData.append("platform", platform);
    formData.append("url", url);

    Swal.fire({
      title: "Are you sure?",
      text: "You can delete it later!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, add it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        await addNewSocialMedia(formData);
        setPlatform("");
        setUrl("");
        setIsChange(false);
        Swal.fire("Added!", "Your social media has been added.", "success");
      }
    });
  };

  const handleDeleteSocialMedia = (id: string) => {
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
    }).then(async (result) => {
      if (result.isConfirmed) {
        await deleteSocialMedia(formData);
        setIsChange(false);
        Swal.fire("Deleted!", "Your social media has been deleted.", "success");
      }
    });
  };

  const handleUpdateSocialMedia = (id: string) => {
    const formData = new FormData();
    setIsChange(true);

    formData.append("id", id);
    formData.append("platform", updatePlatform);
    formData.append("url", updateUrl);

    Swal.fire({
      title: "Are you sure?",
      text: "You can update it later!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, update it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        await updateSocialMedia(formData);
        setUpdatePlatform("");
        setUpdateUrl("");
        setIsChange(false);
        setCollapseState((prev) => ({ ...prev, [id]: false }));
        Swal.fire("Updated!", "Your social media has been updated.", "success");
      }
    });
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-10 w-10/12">
      <div className="rounded-lg shadow-md p-4">
        <p className="text-xl font-bold mb-4">Social media ที่มีอยู่</p>
        <div className="grid grid-cols-1  gap-4">
          {socialMediaList.map((socialMedia) => (
            <div
              key={socialMedia.id}
              className="p-4 border rounded-lg bg-white w-full relative flex flex-col justify-between"
            >
              <h3 className="text-lg font-semibold">{socialMedia.platform}</h3>
              <p className="overflow-auto">{socialMedia.url}</p>
              <div className="grid grid-cols-2 gap-2 py-1">
                <button
                  className="col-span-1 btn btn-error btn-sm btn-outline"
                  onClick={() => handleDeleteSocialMedia(socialMedia.id)}
                >
                  <RxCross1 />
                </button>
                <button
                  className="px-2 py-1 col-span-1 btn btn-warning btn-sm btn-outline"
                  onClick={() => {
                    setUpdatePlatform(socialMedia.platform ?? "");
                    setUpdateUrl(socialMedia.url ?? "");
                    setCollapseState((prev) => ({
                      ...prev,
                      [socialMedia.id]: true,
                    }));
                  }}
                >
                  <MdModeEdit />
                </button>
              </div>

              {collapseState[socialMedia.id] && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                  <div className="bg-white p-6 rounded-lg shadow-lg w-96">
                    <h2 className="text-xl font-bold mb-3">
                      แก้ไข Social Media
                    </h2>
                    <input
                      type="text"
                      value={updatePlatform}
                      placeholder="New platform"
                      onChange={(e) => setUpdatePlatform(e.target.value)}
                      className="input input-bordered input-warning w-full"
                    />
                    <input
                      type="text"
                      value={updateUrl}
                      placeholder="New URL"
                      onChange={(e) => setUpdateUrl(e.target.value)}
                      className="input input-bordered input-warning w-full mt-2"
                    />
                    <div className="flex justify-end mt-4 gap-3">
                      <button
                        className="px-4 py-2 bg-gray-300 rounded"
                        onClick={() =>
                          setCollapseState((prev) => ({
                            ...prev,
                            [socialMedia.id]: false,
                          }))
                        }
                      >
                        ยกเลิก
                      </button>
                      <button
                        className="px-4 py-2 bg-yellow-500 text-white rounded"
                        onClick={() => handleUpdateSocialMedia(socialMedia.id)}
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
        <p className="text-xl font-bold mb-4">เพิ่ม Social Media ใหม่</p>
        <input
          type="text"
          value={platform || ""}
          placeholder="Platform"
          onChange={(e) => setPlatform(e.target.value)}
          className="input input-bordered input-warning w-full"
        />
        <input
          type="text"
          value={url || ""}
          placeholder="URL"
          onChange={(e) => setUrl(e.target.value)}
          className="input input-bordered input-warning w-full mt-2"
        />
        <button
          className="btn btn-outline btn-warning mt-3"
          onClick={handleAddNewSocialMedia}
        >
          เพิ่ม Social media
        </button>
      </div>
    </div>
  );
}
