import { useState, useEffect } from "react";
import type { ChangeEvent } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useFormik } from "formik";
import * as Yup from "yup";
import { toast } from "react-hot-toast";
import { updateProfileApi } from "../../service/apis/user.api";
import { setUser } from "../../store/auth.store";
import type { RootState } from "../../store/store";

export type ProfileFormValues = {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  whatsappNumber: string;
  address: string;
  passportStatus: string;
  passportNo: string;
  enquired: string;
  notificationPreference: {
    sms: boolean;
    whatsapp: boolean;
    email: boolean;
  };
};

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
  firstName:   Yup.string().required("First name is required"),
  lastName:    Yup.string().required("Last name is required"),
  email:       Yup.string().email("Invalid email").required("Email is required"),
  phoneNumber: Yup.string().matches(/^[0-9]{10}$/, "Enter a valid 10-digit number"),
  whatsappNumber: Yup.string().matches(/^[0-9]{10}$/, "Enter a valid 10-digit number"),
  address:     Yup.string(),
  passportStatus: Yup.string(),
  passportNo:  Yup.string(),
});

 let BACKEND_BASE_URL = import.meta.env.VITE_BACKEND_BASE_URL;
  if (!BACKEND_BASE_URL || BACKEND_BASE_URL === "undefined") {
    BACKEND_BASE_URL = "http://localhost:3000";
  }


export const useProfileForm = () => {
  const dispatch = useDispatch();
  const reduxUser = useSelector((state: RootState) => (state.authSlice as any).user);

  const [loading, setLoading]       = useState(false);
  const [fetching, setFetching]     = useState(true);
  const [apiError, setApiError]     = useState<string | null>(null);

  
  const [fileInput, setFileInput] = useState<string>("");
  const [imgSrc, setImgSrc] = useState<string>("");

   const [openPreview, setOpenPreview] = useState(false);
  const [cropModalOpen, setCropModalOpen] = useState(false);
  const [tempImageSrc, setTempImageSrc] = useState<string | null>(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<any>(null);

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
      const image = new Image();
      image.src = tempImageSrc!;
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

  // 🌟 Skip Cropping Option
  const useOriginalImg = () => {
    setImgSrc(tempImageSrc!);
    setFileInput(tempImageSrc!);
    setCropModalOpen(false);
    toast.success("Original image selected!");
  };

  // 🌟 Permanent removal signal dispatch
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
      setLoading(true);
      setApiError(null);
      try {
        // 🌟 Seamlessly inject our image payload straight to your /user/profile-update endpoint
        const addValues = {
          id: reduxUser._id,
          ...values,
          profilePicData: fileInput || "",
        };

        const res = await updateProfileApi(addValues);
        if (res?.success !== false) {
          toast.success("Profile updated successfully.");

          // Force local immutable deep updates to sync store variables
          let syncedReduxUser = { ...reduxUser, ...values };
          
          if (fileInput === "REMOVE") {
            syncedReduxUser.profilePic = null;
          } else if (res?.data?.profilePic) {
            syncedReduxUser.profilePic = res.data.profilePic;
          }

          dispatch(setUser(syncedReduxUser));
          setFileInput(""); // Resets alerting system flags on success
        } else {
          toast.error(res?.message ?? "Failed to update profile.");
        }
      } catch (err: any) {
        toast.error(
          err?.response?.data?.message ?? "Something went wrong. Please try again."
        );
      } finally {
        setLoading(false);
      }
    },
  });

  useEffect(() => {
    if (reduxUser) {
      formik.setValues({
        firstName:   reduxUser.firstName   ?? "",
        lastName:    reduxUser.lastName    ?? "",
        email:       reduxUser.email       ?? "",
        phoneNumber: reduxUser.phoneNumber ?? "",
        whatsappNumber: reduxUser.whatsappNumber ?? "",
        address:     reduxUser.address     ?? "",
        passportStatus: reduxUser.passportStatus ?? "not",
        passportNo:  reduxUser.passportNo  ?? "",
        enquired:    reduxUser.enquired    ?? "no",
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
    openPreview, setOpenPreview, cropModalOpen, setCropModalOpen, tempImageSrc, crop, setCrop, zoom, setZoom, setCroppedAreaPixels, getCroppedImg, useOriginalImg
  };
};