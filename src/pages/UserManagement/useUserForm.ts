import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useFormik } from "formik";
import * as yup from "yup";
import { createUserApi, updateUserApi, getUserByIdApi } from "../../service/apis/user.api";
import { toast } from "react-hot-toast";
import type { UserPayload } from "../../types/payloads/user/user.payloads";


export type UserFormValues = UserPayload & {
  _showPassword: boolean;
};

const emptyValues: UserFormValues = {
  firstName: "",
  lastName: "",
  email: "",
  phoneNumber: "",
  whatsappNumber: "",
  address: "",
  role: "",
  password: "",
  status: "active",
  passportStatus: "not",
  passportNo: "",
  enquired: "no",
  notificationPreference: { sms: false, whatsapp: false, email: true },
  _showPassword: false,
  candidateProfile: {
    nationality: "",
    academic: "",
    technicalQualification: "",
    workExp: ""
  },
  tacProfile: {
    designation: "",
    mode: "both",
    rating: 0,
    areasOfExp: "",  
    languagesKnown: "",
    industryExp: "",
    specialization: ""
  }
};

// ─── Validation Schema ───────────────────────────────────────────────────────
const buildSchema = (isEdit: boolean) =>
  yup.object({
    firstName: yup.string().required("First Name is required"),
    lastName: yup.string().required("Last Name is required"),
    email: yup.string().email("Invalid email address").required("Email is required"),
    phoneNumber: yup
      .string()
      .matches(/^[0-9]{10}$/, "Enter a valid 10-digit number")
      .required("Phone Number is required"),
    whatsappNumber: yup
      .string()
      .matches(/^[0-9]{10}$/, "Enter a valid 10-digit number")
      .required("WhatsApp Number is required"),
    address: yup.string(),
    role: yup.string().required("Please select a role"),
    password: isEdit
      ? yup.string().min(6, "Password must be at least 6 characters")
      : yup.string().min(6, "Password must be at least 6 characters").required("Password is required"),
    passportStatus: yup.string(),
    passportNo: yup.string(),
  });

// ─── Custom Hook ─────────────────────────────────────────────────────────────
export const useUserForm = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isEdit = Boolean(id);

  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(isEdit);
  const [profileImage, setProfileImage] = useState<string | null>(null);

 const formik = useFormik<UserFormValues>({
    initialValues: emptyValues,
    validationSchema: buildSchema(isEdit),
    enableReinitialize: true,
    onSubmit: async (values) => {
      setLoading(true);
      try {
        const { _showPassword, ...cleanPayload } = values;

        if (!cleanPayload.password) {
          delete cleanPayload.password;
        }

         
        if (cleanPayload.role !== 'user') {
          delete cleanPayload.candidateProfile;
        }

        if (cleanPayload.role !== 'tac' && cleanPayload.role !== 'tac_head') {
          delete cleanPayload.tacProfile;
        } else if (cleanPayload.tacProfile) {
           
          const parseArray = (val: any) => typeof val === 'string' ? val.split(',').map(s => s.trim()).filter(Boolean) : val;
          cleanPayload.tacProfile.areasOfExp = parseArray(cleanPayload.tacProfile.areasOfExp);
          cleanPayload.tacProfile.languagesKnown = parseArray(cleanPayload.tacProfile.languagesKnown);
          cleanPayload.tacProfile.industryExp = parseArray(cleanPayload.tacProfile.industryExp);
          cleanPayload.tacProfile.specialization = parseArray(cleanPayload.tacProfile.specialization);
          delete (cleanPayload.tacProfile as any).rating;
        }

        if (isEdit && id) {
          const res = await updateUserApi(id, cleanPayload);
          if (res?.success !== false) {
            toast.success("User updated successfully");
          } else {
            toast.error(res?.message ?? "Failed to update user.");
          }
        } else {
          const res = await createUserApi(cleanPayload);
          if (res?.success !== false) {
            toast.success("User created successfully");
            navigate("/users");
          } else {
            toast.error(res?.message ?? "Failed to create user.");
          }
        }
      } catch (err: any) {
        console.error(err)
      } finally {
        setLoading(false);
      }
    },
  });

  // ── Pre-fill form when editing ─────────────────────────────────────────────
  useEffect(() => {
    if (!isEdit || !id) return;

    const fetchUser = async () => {
      setFetching(true);
      setProfileImage(null);
      try {
        const res = await getUserByIdApi(id);
const u = res?.data?.data?.user ?? res?.data?.user ?? res?.data ?? res;
       if (u) {
       
          let imgPath: string | null = null;
          if (typeof u.profilePic === "string") {
            imgPath = u.profilePic;
          } else if (typeof u.profilePic === "object" && u.profilePic !== null) {
            imgPath = (u.profilePic as { path?: string })?.path ?? null;
          }

          setProfileImage(imgPath);
          formik.setValues({
            firstName: u.firstName ?? "",
            lastName: u.lastName ?? "",
            email: u.email ?? "",
            phoneNumber: u.phoneNumber ?? "",
            whatsappNumber: u.whatsappNumber ?? "",
            address: u.address ?? "",
            role: u.role ?? "",
            password: "",
            status: u.status ?? "active",
            passportStatus: u.passportStatus ?? "not",
            passportNo: u.passportNo ?? "",
            enquired: u.enquired ?? "no",
            notificationPreference: u.notificationPreference ?? {
              sms: false,
              whatsapp: false,
              email: true,
            },
            _showPassword: false,
            candidateProfile: {
              nationality: u.candidateProfile?.nationality ?? "",
              academic: u.candidateProfile?.academic ?? "",
              technicalQualification: u.candidateProfile?.technicalQualification ?? "",
              workExp: u.candidateProfile?.workExp ?? "",
            },
            tacProfile: {
              designation: u.tacProfile?.designation ?? "",
              mode: u.tacProfile?.mode ?? "both",
              rating: u.tacProfile?.rating ?? 0,
              areasOfExp: u.tacProfile?.areasOfExp?.join(', ') || "",
              languagesKnown: u.tacProfile?.languagesKnown?.join(', ') || "",
              industryExp: u.tacProfile?.industryExp?.join(', ') || "",
              specialization: u.tacProfile?.specialization?.join(', ') || ""
            }
          });
        }
      } catch (err: any) {
        console.error(err)
      } finally {
        setFetching(false);
      }
    };

    fetchUser();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, isEdit]);

  return { formik, loading, fetching, isEdit,profileImage  };
};