import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useFormik } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";
import { getUserByIdApi, updateProfileApi } from "../../service/apis/user.api";
import httpsCall from "../../service/httpCall";
import { setUser } from "../../store/auth.store";
import type { RootState } from "../../store/store";

// ─── Types ────────────────────────────────────────────────────────────────────

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

// ─── Validation ───────────────────────────────────────────────────────────────

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

// ─── Hook ─────────────────────────────────────────────────────────────────────

export const useProfileForm = () => {
  const dispatch = useDispatch();
  const reduxUser = useSelector((state: RootState) => (state.authSlice as any).user);

  const [loading, setLoading]       = useState(false);
  const [fetching, setFetching]     = useState(true);
  const [apiError, setApiError]     = useState<string | null>(null);

  // ── Profile picture ────────────────────────────────────────────────────────
  const [avatarPreview, setAvatarPreview]   = useState<string | null>(null);
  const [avatarFile, setAvatarFile]         = useState<File | null>(null);
  const [avatarUploading, setAvatarUploading] = useState(false);

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setAvatarFile(file);
    setAvatarPreview(URL.createObjectURL(file));
  };

  const uploadAvatar = async (): Promise<void> => {
    if (!avatarFile) return;
    setAvatarUploading(true);
    try {
      const form = new FormData();
      form.append("profilePicture", avatarFile);
      const res = await httpsCall.patch("/admin/auth/update-profile-picture", form, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      if (res.data?.success !== false) {
        dispatch(setUser({ ...reduxUser, profilePicture: res.data?.data?.profilePicture }));
        toast.success("Profile picture updated.");
        setAvatarFile(null);
      } else {
        toast.error(res.data?.message ?? "Failed to upload picture.");
      }
    } catch (err: any) {
      toast.error(err?.response?.data?.message ?? "Upload failed.");
    } finally {
      setAvatarUploading(false);
    }
  };

  const formik = useFormik<ProfileFormValues>({
    initialValues: emptyValues,
    validationSchema,
    enableReinitialize: true,
    onSubmit: async (values) => {
      setLoading(true);
      setApiError(null);
      try {
        const addValues={id:reduxUser._id,...values};
        const res = await updateProfileApi(addValues);
        if (res?.success !== false) {
          // keep Redux store in sync with updated profile
          dispatch(setUser({ ...reduxUser, ...values }));
          toast.success(res?.message ?? "Profile updated successfully.");
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

  // ── Load profile on mount ──────────────────────────────────────────────────
  useEffect(() => {
//     const fetchProfile = async () => {
//       setFetching(true);
//       setApiError(null);
//       try {
//         const res = await getUserByIdApi(reduxUser._id);
//         const u = res?.data?.user ?? res;
//         if (u) {
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
//         }
//       } catch (err: any) {
//         setApiError(
//           err?.response?.data?.message ?? "Failed to load profile."
//         );
//       } finally {
//         setFetching(false);
//       }
//     };

//     fetchProfile();
        setFetching(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { formik, loading, fetching, apiError, reduxUser, avatarPreview, avatarFile, avatarUploading, handleAvatarChange, uploadAvatar };
};
