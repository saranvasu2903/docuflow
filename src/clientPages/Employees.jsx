"use client";

import React, { useState, useEffect, useRef } from "react";
import { useUser } from "@clerk/nextjs";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";
import EmployeesHeader from "@/components/employee/EmployeesHeader";
import EmployeesTable from "@/components/employee/EmployeesTable";
import EmployeeSidebar from "@/components/employee/EmployeeSidebar";

import {
  useCreateTeamMember,
  useGetTeamMembers,
  useUpdateTeamMember,
} from "@/hooks/teammembers";
import { useGetOrganization } from "@/hooks/organization";

import LoadingSpinner from "@/components/LoadingSpinner";

export default function Employees() {
  const { user, isLoaded } = useUser();
  const createdBy = user?.id;
  const { role } = useSelector((state) => state.user);
  const isAdmin = role === "admin";

  const { organization, isLoading: isOrgLoading } =
    useGetOrganization(createdBy);
  const { teamMembers, isLoading: isTeamLoading } = useGetTeamMembers(
    organization?.id
  );
  const { createTeamMember, isCreating } = useCreateTeamMember();
  const { updateTeamMember, isUpdating } = useUpdateTeamMember();

  const [addForm, setAddForm] = useState({ fullname: "", email: "" });
  const [addErrors, setAddErrors] = useState({ fullname: "", email: "" });
  const [editForm, setEditForm] = useState({
    fullname: "",
    role: "",
    status: "",
  });
  const [editErrors, setEditErrors] = useState({
    fullname: "",
    role: "",
    status: "",
  });
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedMember, setSelectedMember] = useState(null);
  const [isAddMode, setIsAddMode] = useState(false);
  const sidebarRef = useRef(null);

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const handleAddChange = (e) => {
    const { name, value } = e.target;
    setAddForm((prev) => ({ ...prev, [name]: value }));
    setAddErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditForm((prev) => ({ ...prev, [name]: value }));
    setEditErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validateAdd = () => {
    const newErrors = { fullname: "", email: "" };
    if (!addForm.fullname.trim()) newErrors.fullname = "Full name is required";
    if (!addForm.email.trim()) newErrors.email = "Email is required";
    else if (!emailRegex.test(addForm.email))
      newErrors.email = "Invalid email address";
    setAddErrors(newErrors);
    return !Object.values(newErrors).some(Boolean);
  };

  const validateEditForm = () => {
    const newErrors = { fullname: "", role: "", status: "" };
    if (!editForm.fullname.trim()) newErrors.fullname = "Full name is required";
    if (!editForm.role.trim()) newErrors.role = "Role is required";
    if (!editForm.status.trim()) newErrors.status = "Status is required";
    setEditErrors(newErrors);
    return !Object.values(newErrors).some(Boolean);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isAddMode) {
      if (!validateAdd()) return;
      if (!createdBy) return toast.error("User not authenticated");
      if (!organization?.id) return toast.error("Organization data not loaded");

      const payload = {
        parentid: createdBy,
        fullname: addForm.fullname.trim(),
        email: addForm.email.trim(),
        organizationid: organization.id,
        Org_ID: organization.Org_ID,
      };

      createTeamMember(payload, {
        onSuccess: () => {
          setAddForm({ fullname: "", email: "" });
          setSidebarOpen(false);
          toast.success("Team member added successfully");
        },
        onError: (error) => {
          toast.error(
            error?.response?.data?.error || "Failed to add team member"
          );
        },
      });
    } else if (selectedMember) {
      if (!validateEditForm()) return;
      const payload = {
        id: selectedMember.id,
        fullname: editForm.fullname.trim(),
        role: editForm.role.trim(),
        status: editForm.status.trim(),
      };

      updateTeamMember(payload, {
        onSuccess: () => {
          toast.success("Team member updated successfully");
          setSidebarOpen(false);
          setSelectedMember(null);
        },
        onError: (error) =>
          toast.error(error.message || "Failed to update team member"),
      });
    }
  };

  const handleAdd = () => {
    setIsAddMode(true);
    setAddForm({ fullname: "", email: "" });
    setSidebarOpen(true);
  };

  const handleEdit = (member) => {
    setIsAddMode(false);
    setSelectedMember(member);
    setEditForm({
      fullname: member.fullname || "",
      role: member.userDetails?.role || "",
      status: member.status || "",
    });
    setSidebarOpen(true);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
        setSidebarOpen(false);
      }
    };
    if (sidebarOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [sidebarOpen]);

  if (!isLoaded || isOrgLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="w-full mx-auto p-6 bg-white">
      <EmployeesHeader isAdmin={isAdmin} onAdd={handleAdd} />

      <EmployeesTable
        teamMembers={teamMembers}
        isTeamLoading={isTeamLoading}
        isAdmin={isAdmin}
        onEdit={handleEdit}
        onAdd={handleAdd}
      />

      <EmployeeSidebar
        sidebarOpen={sidebarOpen}
        sidebarRef={sidebarRef}
        isAddMode={isAddMode}
        addForm={addForm}
        addErrors={addErrors}
        editForm={editForm}
        editErrors={editErrors}
        handleAddChange={handleAddChange}
        handleEditChange={handleEditChange}
        handleSubmit={handleSubmit}
        setSidebarOpen={setSidebarOpen}
        isCreating={isCreating}
        isUpdating={isUpdating}
      />
    </div>
  );
}
