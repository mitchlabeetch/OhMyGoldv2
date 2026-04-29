import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";

export type Lead = {
  id: string;
  first_name: string;
  last_name: string;
  email?: string;
  phone?: string;
  status: "new" | "contacted" | "qualified" | "converted" | "lost";
  assigned_to?: string;
  notes?: string;
  location_id?: string;
  created_at: string;
  updated_at: string;
};

export type LeadActivity = {
  id: string;
  lead_id: string;
  type: "call" | "email" | "meeting" | "note" | "task";
  description: string;
  performed_by: string;
  performed_at: string;
  created_at: string;
};

export type LeadFilters = {
  status?: string;
  assignedTo?: string;
};

export function useLeads(filters?: LeadFilters) {
  return useQuery({
    queryKey: ["crm", "leads", filters],
    queryFn: async () => {
      let query = supabase
        .from("leads")
        .select("*, user_profiles!assigned_to(first_name, last_name)")
        .order("created_at", { ascending: false });

      if (filters?.status) {
        query = query.eq("status", filters.status);
      }
      if (filters?.assignedTo) {
        query = query.eq("assigned_to", filters.assignedTo);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data;
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
}

export function useLead(id: string) {
  return useQuery({
    queryKey: ["crm", "leads", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("leads")
        .select("*, user_profiles!assigned_to(first_name, last_name, email), lead_activities(*)")
        .eq("id", id)
        .single();
      if (error) throw error;
      return data;
    },
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
}

export function useCreateLead() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (payload: Omit<Lead, "id" | "created_at" | "updated_at">) => {
      const { data, error } = await supabase
        .from("leads")
        .insert(payload)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["crm", "leads"] }),
  });
}

export function useUpdateLead() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...payload }: Partial<Lead> & { id: string }) => {
      const { data, error } = await supabase
        .from("leads")
        .update(payload)
        .eq("id", id)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: (_, { id }) => {
      qc.invalidateQueries({ queryKey: ["crm", "leads"] });
      qc.invalidateQueries({ queryKey: ["crm", "leads", id] });
    },
  });
}

export function useLeadActivities(leadId: string) {
  return useQuery({
    queryKey: ["crm", "lead-activities", leadId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("lead_activities")
        .select("*, user_profiles!performed_by(first_name, last_name)")
        .eq("lead_id", leadId)
        .order("performed_at", { ascending: false });
      if (error) throw error;
      return data;
    },
    enabled: !!leadId,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
}

export function useCreateLeadActivity() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (
      payload: Omit<LeadActivity, "id" | "created_at">,
    ) => {
      const { data, error } = await supabase
        .from("lead_activities")
        .insert(payload)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: (_, { lead_id }) => {
      qc.invalidateQueries({ queryKey: ["crm", "lead-activities", lead_id] });
      qc.invalidateQueries({ queryKey: ["crm", "leads", lead_id] });
    },
  });
}
