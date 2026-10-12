export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type ProfileRole = 'admin' | 'pcu';
export type ProfileStatus = 'pending' | 'approved' | 'rejected';
export type RequisitionStatus = 'draft' | 'submitted' | 'approved' | 'fulfilled' | 'rejected';
export type RequisitionPeriodStatus = 'open' | 'closed';

/**
 * NOTE: these types were verified against the live database (project
 * zerwobmlglmmphxxjjsv) because the previously generated file declared
 * most primary/foreign keys as `number` when they are actually `uuid`.
 *
 * uuid columns  -> string
 * bigint/int columns -> number
 *
 * Keep this in sync with the real schema; the app passes ids straight
 * through to PostgREST, so a wrong type here becomes a runtime cast error
 * ("invalid input syntax for type uuid: \"NaN\"").
 */
export type Database = {
  public: {
    Tables: {
      profiles_drugcupsabot: {
        Row: {
          id: string;
          username: string;
          email: string;
          role: ProfileRole;
          pcu_id: string;
          status: ProfileStatus;
          created_at: string;
        };
        Insert: {
          id: string;
          username: string;
          email: string;
          role?: ProfileRole;
          pcu_id: string;
          status?: ProfileStatus;
          created_at?: string;
        };
        Update: {
          id?: string;
          username?: string;
          email?: string;
          role?: ProfileRole;
          pcu_id?: string;
          status?: ProfileStatus;
          created_at?: string;
        };
        Relationships: [];
      };
      pcus_drugcupsabot: {
        Row: {
          id: string;
          name: string;
        };
        Insert: {
          id?: string;
          name: string;
        };
        Update: {
          id?: string;
          name?: string;
        };
        Relationships: [];
      };
      items_drugcupsabot: {
        Row: {
          id: number;
          name: string;
          unit_pack: string;
          price_per_unit: number;
          category: string;
          category_order: number | null;
          item_order: number | null;
          is_active: boolean;
          is_available: boolean;
          notes: string | null;
          created_at: string;
        };
        Insert: {
          id?: number;
          name: string;
          unit_pack: string;
          price_per_unit: number;
          category: string;
          category_order?: number | null;
          item_order?: number | null;
          is_active?: boolean;
          is_available?: boolean;
          notes?: string | null;
          created_at?: string;
        };
        Update: {
          id?: number;
          name?: string;
          unit_pack?: string;
          price_per_unit?: number;
          category?: string;
          category_order?: number | null;
          item_order?: number | null;
          is_active?: boolean;
          is_available?: boolean;
          notes?: string | null;
          created_at?: string;
        };
        Relationships: [];
      };
      requisition_periods_drugcupsabot: {
        Row: {
          id: string;
          name: string;
          start_date: string;
          end_date: string;
          status: RequisitionPeriodStatus;
        };
        Insert: {
          id?: string;
          name: string;
          start_date: string;
          end_date: string;
          status?: RequisitionPeriodStatus;
        };
        Update: {
          id?: string;
          name?: string;
          start_date?: string;
          end_date?: string;
          status?: RequisitionPeriodStatus;
        };
        Relationships: [];
      };
      requisitions_drugcupsabot: {
        Row: {
          id: string;
          pcu_id: string;
          period_id: string;
          requester_id: string;
          status: RequisitionStatus;
          submitted_at: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          pcu_id: string;
          period_id: string;
          requester_id: string;
          status?: RequisitionStatus;
          submitted_at?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          pcu_id?: string;
          period_id?: string;
          requester_id?: string;
          status?: RequisitionStatus;
          submitted_at?: string | null;
          created_at?: string;
        };
        Relationships: [];
      };
      requisition_items_drugcupsabot: {
        Row: {
          id: number;
          requisition_id: string;
          item_id: number;
          quantity: number;
          on_hand_quantity: number | null;
          approved_quantity: number | null;
          price_at_request: number;
        };
        Insert: {
          id?: number;
          requisition_id: string;
          item_id: number;
          quantity: number;
          on_hand_quantity?: number | null;
          approved_quantity?: number | null;
          price_at_request: number;
        };
        Update: {
          id?: number;
          requisition_id?: string;
          item_id?: number;
          quantity?: number;
          on_hand_quantity?: number | null;
          approved_quantity?: number | null;
          price_at_request?: number;
        };
        Relationships: [];
      };
      pcu_personnel_drugcupsabot: {
        Row: {
          id: number;
          pcu_id: string;
          requester_name: string | null;
          requester_position: string | null;
          receiver_name: string | null;
          receiver_position: string | null;
        };
        Insert: {
          id?: number;
          pcu_id: string;
          requester_name?: string | null;
          requester_position?: string | null;
          receiver_name?: string | null;
          receiver_position?: string | null;
        };
        Update: {
          id?: number;
          pcu_id?: string;
          requester_name?: string | null;
          requester_position?: string | null;
          receiver_name?: string | null;
          receiver_position?: string | null;
        };
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: {
      update_approved_quantities: {
        Args: {
          items_data: Array<{
            id: number;
            approved_quantity: number;
          }>;
        };
        Returns: undefined;
      };
      get_accounting_summary_by_period: {
        Args: {
          period_id_param: string;
        };
        Returns: Array<{
          pcu_id: string;
          pcu_name: string;
          total_value: number;
        }>;
      };
    };
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};
