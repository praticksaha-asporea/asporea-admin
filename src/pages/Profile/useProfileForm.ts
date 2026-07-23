import { useState, useEffect } from "react";
import type { ChangeEvent } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useFormik } from "formik";
import * as Yup from "yup";
import { toast } from "react-hot-toast";
import { updateProfileApi } from "../../service/apis/user.api";
import { setUser } from "../../store/auth.store";
import type { RootState } from "../../store/store";
import type { ProfilePayload } from "../../types/payloads/user/user.payloads";
import type { UserResponseData } from "../../types/responses/user/user.responses";

export type ProfileFormValues = Omit<ProfilePayload, "id" | "profilePicData">;

export interface AreaPixels {
  x: number;
  y: number;
  width: number;
  height: number;
}

const emptyValues: ProfileFormValues = {
  firstName: "",
  lastName: "",
  email: "",
  phoneNumber: "",
  whatsappNumber: "",
  address: "",
  passportStatus: "not",
  passportNo: "",
  enquired: "no",
  notificationPreference: { sms: false, whatsapp: false, email: true },
};

const validationSchema = Yup.object({
  firstName: Yup.string().required("First name is required"),
  lastName: Yup.string().required("Last name is required"),
  email: Yup.string().email("Invalid email").required("Email is required"),
  phoneNumber: Yup.string().matches(/^[0-9]{10}$/, "Enter a valid 10-digit number"),
  whatsappNumber: Yup.string().matches(/^[0-9]{10}$/, "Enter a valid 10-digit number"),
  address: Yup.string(),
  passportStatus: Yup.string(),
  passportNo: Yup.string(),
});

let BACKEND_BASE_URL = import.meta.env.VITE_BACKEND_BASE_URL;
// if (!BACKEND_BASE_URL || BACKEND_BASE_URL === "undefined") {
//   BACKEND_BASE_URL = "http://localhost:3000";
// }



export const useProfileForm = () => {
  const dispatch = useDispatch();
  const reduxUser = useSelector((state: RootState) => state.authSlice.user) as UserResponseData | null;
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [apiError, setApiError] = useState<string | null>(null);


  const [fileInput, setFileInput] = useState<string>("");
  const [imgSrc, setImgSrc] = useState<string>("");

  const [openPreview, setOpenPreview] = useState(false);
  const [cropModalOpen, setCropModalOpen] = useState(false);
  const [tempImageSrc, setTempImageSrc] = useState<string | null>(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<AreaPixels | null>(null);

  useEffect(() => {
    if (reduxUser?.profilePic?.path) {
      const path = reduxUser.profilePic.path;


      if (path.startsWith("data:image")) {
        setImgSrc(path);
      }

      else if (path.startsWith("/")) {
        setImgSrc(`${BACKEND_BASE_URL}${path}`);
      }

      else {
        setImgSrc(path);
      }
    } else {
      setImgSrc("");
    }
  }, [reduxUser]);


  const handleAvatarChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 800 * 1024) {
      toast.error("File is too large! Please choose an image under 800KB.");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setTempImageSrc(reader.result as string);
      setCropModalOpen(true);
    };
    reader.readAsDataURL(file);
  };
  const getCroppedImg = async () => {
    try {
      if (!croppedAreaPixels || !tempImageSrc) return;

      const image = new Image();
      image.src = tempImageSrc;
      await new Promise((resolve) => (image.onload = resolve));

      const canvas = document.createElement("canvas");
      canvas.width = croppedAreaPixels.width;
      canvas.height = croppedAreaPixels.height;
      const ctx = canvas.getContext("2d");

      if (!ctx) return;

      ctx.drawImage(
        image,
        croppedAreaPixels.x,
        croppedAreaPixels.y,
        croppedAreaPixels.width,
        croppedAreaPixels.height,
        0,
        0,
        croppedAreaPixels.width,
        croppedAreaPixels.height
      );

      const croppedBase64 = canvas.toDataURL("image/jpeg");
      setImgSrc(croppedBase64);
      setFileInput(croppedBase64);
      setCropModalOpen(false);
      toast.success("Image cropped successfully!");
    } catch (err) {
      toast.error("Failed to crop image.");
    }
  };


  const useOriginalImg = () => {
    setImgSrc(tempImageSrc!);
    setFileInput(tempImageSrc!);
    setCropModalOpen(false);
    toast.success("Original image selected!");
  };


  const handleAvatarReset = () => {
    setFileInput("REMOVE");
    setImgSrc("");
    toast.success("Picture staging area cleared! Click 'Save Changes' to confirm.");
  };
  const formik = useFormik<ProfileFormValues>({
    initialValues: emptyValues,
    validationSchema,
    enableReinitialize: true,
    onSubmit: async (values) => {

      if (!reduxUser?._id) return;

      setLoading(true);
      setApiError(null);
      try {

        const addValues: ProfilePayload = {
          id: reduxUser._id,
          ...values,
          profilePicData: fileInput || "",
        };

        const res = await updateProfileApi(addValues);
        if (res?.success !== false) {
          toast.success("Profile updated successfully.");


          const syncedReduxUser: UserResponseData = {
            ...reduxUser,
            ...values,
            profilePic: fileInput === "REMOVE" ? null : (res?.data?.profilePic ?? reduxUser.profilePic)
          };

          dispatch(setUser(syncedReduxUser));
          setFileInput("");
        } else {
          toast.error(res?.message ?? "Failed to update profile.");
        }
      } catch (err: any) {
        console.error(err)
      } finally {
        setLoading(false);
      }
    },
  });

  useEffect(() => {
    if (reduxUser) {
      formik.setValues({
        firstName: reduxUser.firstName ?? "",
        lastName: reduxUser.lastName ?? "",
        email: reduxUser.email ?? "",
        phoneNumber: reduxUser.phoneNumber ?? "",
        whatsappNumber: reduxUser.whatsappNumber ?? "",
        address: reduxUser.address ?? "",
        passportStatus: reduxUser.passportStatus ?? "not",
        passportNo: reduxUser.passportNo ?? "",
        enquired: reduxUser.enquired ?? "no",
        notificationPreference: reduxUser.notificationPreference ?? {
          sms: false, whatsapp: false, email: true,
        },
      });
    }
    setFetching(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reduxUser]);

  return {
    formik, loading, fetching, apiError, reduxUser, imgSrc, fileInput, handleAvatarChange, handleAvatarReset,
    openPreview, setOpenPreview, cropModalOpen, setCropModalOpen, tempImageSrc, crop, setCrop, zoom, setZoom, setCroppedAreaPixels, getCroppedImg, useOriginalImg, setImgSrc
  };
};