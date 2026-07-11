import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import { toast } from "react-hot-toast";
import {
  createAssignmentApi,
  getAssignmentByIdApi,
  updateAssignmentApi
} from "../../service/apis/assignment.api";
import { getUniqueRolesApi, getUsersByRoleApi } from "../../service/apis/user.api";
import { getBranchesApi } from "../../service/apis/branch.api";
import { getShiftsApi } from "../../service/apis/shift.api";

 
import type { AssignmentPayload } from "../../types/payloads/assignment/assignment.payloads";
import type { BranchResponseData } from "../../types/responses/branch/branch.responses";
import type { ShiftResponseData } from "../../types/responses/shift/shift.responses";
import type { UserResponseData } from "../../types/responses/user/user.responses";
 
export type AssignmentFormValues = Omit<AssignmentPayload, "counterNo"> & {
  counterNo: string;
};

 
export type DropdownUser = Pick<UserResponseData, "_id" | "firstName" | "lastName" | "role">;
export type DropdownRole = string;
export type DropdownBranch = Pick<BranchResponseData, "_id" | "title">;
export type DropdownShift = Pick<ShiftResponseData, "_id" | "shiftName">;

const emptyValues: AssignmentFormValues = {
  role: "",
  employeeId: "",
  branchId: "",
  shiftId: "",
  effectiveFrom: new Date().toISOString().split("T")[0],
  minuteOfSlots: 30,
  counterNo: "",
};

const validationSchema = Yup.object({
  role: Yup.string().required("Role is required to filter"),
  employeeId: Yup.string().required("Please select an employee"),
  branchId: Yup.string().required("Please select a branch"),
  shiftId: Yup.string().required("Please select a shift"),
  effectiveFrom: Yup.date()
    .min(new Date(new Date().setHours(0, 0, 0, 0)), "Past dates are not allowed")
    .required("Date is required"),
  minuteOfSlots: Yup.number().min(5, "Min 5 mins").required("Required"),
  counterNo: Yup.number().when("role", {
    is: (role: string) => ["tac", "coordinator"].includes(role),
    then: (schema) => schema.required("Counter number is required"),
    otherwise: (schema) => schema.optional(),
  }),
});

export const useAssignmentForm = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isEdit = Boolean(id);

  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(isEdit);
  const [apiError, setApiError] = useState<string | null>(null);

  const [filteredUsers, setFilteredUsers] = useState<DropdownUser[]>([]);
  const [usersLoading, setUsersLoading] = useState(false);
  const [uniqueRoles, setUniqueRoles] = useState<DropdownRole[]>([]);
  const [branches, setBranches] = useState<DropdownBranch[]>([]);
  const [shifts, setShifts] = useState<DropdownShift[]>([]);

  useEffect(() => {
    const loadDropdowns = async () => {
      try {
        const [rRes, bRes, sRes] = await Promise.all([
          getUniqueRolesApi(),
          getBranchesApi(),
          getShiftsApi(),
        ]);

        const BLOCKED_ROLES = new Set(["user", "admin", "pca", "pcra", "institute", "sub_pca"]);
        const uniqueRolesFiltered: DropdownRole[] =
          (rRes?.data as any)?.filter((role: string) => !BLOCKED_ROLES.has(role)) || [];

        setUniqueRoles(uniqueRolesFiltered);
        setBranches((bRes?.data as any)?.data ?? []);
        setShifts((sRes?.data as any)?.data ?? []);
      } catch {
        // non-fatal
      }
    };
    loadDropdowns();
  }, []);

  const fetchUsersByRole = async (role: string) => {
    if (!role) { setFilteredUsers([]); return; }
    setUsersLoading(true);
    try {
      const res = await getUsersByRoleApi(role);
      setFilteredUsers((res?.data as any)?.data ?? []);
    } catch {
      setFilteredUsers([]);
    } finally {
      setUsersLoading(false);
    }
  };

  const formik = useFormik<AssignmentFormValues>({
    initialValues: emptyValues,
    validationSchema,
    enableReinitialize: true,
    onSubmit: async (values) => {
      setLoading(true);
      setApiError(null);
      try {
        const cleanPayload: AssignmentPayload = {
          ...values,
          counterNo: values.counterNo ? Number(values.counterNo) : undefined,
          minuteOfSlots: Number(values.minuteOfSlots),
        };

        if (isEdit && id) {
          const res = await updateAssignmentApi(id, cleanPayload);
          if (res?.success !== false) {
            toast.success("Assignment updated successfully.");
            navigate("/employees");
          } else {
            setApiError(res?.message ?? "Failed to update assignment.");
          }
        } else {
          const res = await createAssignmentApi(cleanPayload);
          if (res?.success !== false) {
            toast.success("Employee assigned successfully.");
            navigate("/employees");
          } else {
            setApiError(res?.message ?? "Failed to create assignment.");
          }
        }
      } catch (err: any) {
        setApiError(err?.response?.data?.message ?? "Something went wrong. Please try again.");
      } finally {
        setLoading(false);
      }
    },
  });

  useEffect(() => {
    if (!isEdit || !id) return;
    const fetchAssignment = async () => {
      setFetching(true);
      setApiError(null);
      try {
        const res = await getAssignmentByIdApi(id);
        const a = (res?.data as any) ?? res;
        if (a) {
          formik.setValues({
            role: a.role ?? "",
            employeeId: typeof a.employeeId === "object" ? a.employeeId._id : a.employeeId ?? "",
            branchId: typeof a.branchId === "object" ? a.branchId._id : a.branchId ?? "",
            shiftId: typeof a.shiftId === "object" ? a.shiftId._id : a.shiftId ?? "",
            effectiveFrom: a.effectiveFrom?.split("T")[0] ?? emptyValues.effectiveFrom,
            minuteOfSlots: a.minuteOfSlots ?? 30,
            counterNo: a.counterNo ? String(a.counterNo) : "",
          });
          
          if (a.role) fetchUsersByRole(a.role);
        }
      } catch (err: any) {
        setApiError(err?.response?.data?.message ?? "Failed to load assignment details.");
      } finally {
        setFetching(false);
      }
    };
    fetchAssignment();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, isEdit]);

  return {
    formik, loading, fetching, apiError, isEdit, branches, shifts,
    filteredUsers, usersLoading, uniqueRoles, fetchUsersByRole,
  };
};