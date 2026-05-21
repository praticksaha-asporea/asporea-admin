import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import { toast } from "react-hot-toast";
import {
  createAssignmentApi
  // getAssignmentByIdApi,
} from "../../service/apis/assignment.api";
import { getUniqueRolesApi, getUsersByRoleApi } from "../../service/apis/user.api";
import { getBranchesApi } from "../../service/apis/branch.api";
import { getShiftsApi } from "../../service/apis/shift.api";

// ─── Types ────────────────────────────────────────────────────────────────────

export type AssignmentFormValues = {
  role: string;
  employeeId: string;
  branchId: string;
  shiftId: string;
  effectiveFrom: string;
  minuteOfSlots: number;
  counterNo?: string;
};

export type DropdownUser = { _id: string; firstName: string; lastName: string; role: string };
export type DropdownRole = string;
export type DropdownBranch = { _id: string; title: string };
export type DropdownShift = { _id: string; shiftName: string };

const emptyValues: AssignmentFormValues = {
  role: "",
  employeeId: "",
  branchId: "",
  shiftId: "",
  effectiveFrom: new Date().toISOString().split("T")[0],
  minuteOfSlots: 30,
  counterNo: "",
};

// ─── Validation ───────────────────────────────────────────────────────────────

const validationSchema = Yup.object({
  role: Yup.string().required("Role is required to filter"),
  employeeId: Yup.string().required("Please select an employee"),
  branchId: Yup.string().required("Please select a branch"),
  shiftId: Yup.string().required("Please select a shift"),
  effectiveFrom: Yup.date().required("Date is required"),
  minuteOfSlots: Yup.number().min(5, "Min 5 mins").required("Required"),
  counterNo: Yup.number()
  .when("role", {
    is: (role: string) => ["tac", "coordinator"].includes(role),
    then: (schema) => schema.required("Counter number is required"),
    otherwise: (schema) => schema
    .optional(),
  }),
});

// ─── Hook ─────────────────────────────────────────────────────────────────────

export const useAssignmentForm = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isEdit = Boolean(id);

  const [loading, setLoading] = useState(false);
  const [fetching] = useState(isEdit);
  const [apiError, setApiError] = useState<string | null>(null);

  // ── Dropdown data ──────────────────────────────────────────────────────────
  const [filteredUsers, setFilteredUsers]   = useState<DropdownUser[]>([]);
  const [usersLoading, setUsersLoading]     = useState(false);
  const [uniqueRoles, setUniqueRoles]       = useState<DropdownRole[]>([]);
  const [branches, setBranches]             = useState<DropdownBranch[]>([]);
  const [shifts, setShifts]                 = useState<DropdownShift[]>([]);

  // Load roles, branches, shifts on mount (not users — those load on role change)
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
          rRes?.data.filter((role: string) => !BLOCKED_ROLES.has(role));

        setUniqueRoles(uniqueRolesFiltered || []);
        setBranches(bRes?.data?.data ?? []);
        setShifts(sRes?.data?.data ?? []);
      } catch {
        // non-fatal
      }
    };
    loadDropdowns();
  }, []);

  // ── Fetch users when role changes ──────────────────────────────────────────
  const fetchUsersByRole = async (role: string) => {
    if (!role) { setFilteredUsers([]); return; }
    setUsersLoading(true);
    try {
      const res = await getUsersByRoleApi(role);
      setFilteredUsers(res?.data?.data ?? []);
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
        if (isEdit && id) {
          // const { role, ...removeRole } = values;
          // const res = await updateAssignmentApi(id, removeRole);
          // if (res?.success !== false) {
          //   toast.success("Assignment updated successfully.");
          //   navigate("/employees");
          // } else {
          //   setApiError(res?.message ?? "Failed to update assignment.");
          // }
        } else {
          // const removeEmptyCounter = values.counterNo != "" ? 0 : 1;
          // const { counterNo, ...removeCounter } = values;
          // const { role, ...removeRole } = removeEmptyCounter ? removeCounter : values;

          const res = await createAssignmentApi(values);
          if (res?.success !== false) {
            toast.success("Employee assigned successfully.");
            navigate("/employees");
          } else {
            setApiError(res?.message ?? "Failed to create assignment.");
          }
        }
      } catch (err: any) {
        // setApiError(
        //   err?.response?.data?.message ?? "Something went wrong. Please try again."
        // );
        // toast.error(err?.response?.data?.message ?? "Something went wrong. Please try again.");
      } finally {
        setLoading(false);
      }
    },
  });

  // ── Pre-fill on edit ───────────────────────────────────────────────────────
  // useEffect(() => {
  //   if (!isEdit || !id) return;

  //   const fetchAssignment = async () => {
  //     setFetching(true);
  //     setApiError(null);
  //     try {
  //       const res = await getAssignmentByIdApi(id);
  //       const a = res?.data ?? res;
  //       if (a) {
  //         formik.setValues({
  //           role: a.role ?? "",
  //           employeeId: a.employeeId ?? "",
  //           branchId: a.branchId ?? "",
  //           shiftId: a.shiftId ?? "",
  //           effectiveFrom: a.effectiveFrom?.split("T")[0] ?? emptyValues.effectiveFrom,
  //           minuteOfSlots: a.minuteOfSlots ?? 30,
  //           counterNo: a.counterNo ?? 1,
  //         });
  //       }
  //     } catch (err: any) {
  //       setApiError(
  //         err?.response?.data?.message ?? "Failed to load assignment details."
  //       );
  //     } finally {
  //       setFetching(false);
  //     }
  //   };

  //   fetchAssignment();
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [id]);

  // ── Derived: users filtered by selected role ───────────────────────────────
 

  return {
    formik,
    loading,
    fetching,
    apiError,
    isEdit,
    branches,
    shifts,
    filteredUsers,
    usersLoading,
    uniqueRoles,
    fetchUsersByRole,
  };
};
