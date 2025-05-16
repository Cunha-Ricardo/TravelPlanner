import { apiRequest } from "@/lib/queryClient";

/**
 * Sends a message to the OpenAI API via our backend
 * @param message The user's message to send to the AI
 * @returns The AI's response
 */
export async function sendMessage(message: string) {
  const response = await apiRequest("POST", "/api/chat", { message });
  return response.json();
}

/**
 * Generates a travel itinerary based on the given parameters
 * @param params The itinerary parameters
 * @returns The generated itinerary
 */
export async function generateItinerary(params: {
  mainDestination: string;
  otherDestinations: string[];
  startDate: string;
  endDate: string;
  interests: string[];
  preferences: string;
}) {
  const response = await apiRequest("POST", "/api/itinerary", params);
  return response.json();
}

/**
 * Generates a travel checklist based on the given parameters
 * @param params The checklist parameters
 * @returns The generated checklist
 */
export async function generateChecklist(params: {
  destination: string;
  climate: string;
  duration: number;
  tripType: string;
  confirmedItems: string[];
}) {
  const response = await apiRequest("POST", "/api/checklist", params);
  return response.json();
}
