export interface ExternalSourcePayload {
  name: string;
  type: "pca" | "pcra" | "institute";
  status?: "active" | "inactive";
}