import { createContext, useContext } from "react";

export const FeedbackContext = createContext(null);

export function useConfirm() {
  return useContext(FeedbackContext).confirmar;
}

export function useToast() {
  return useContext(FeedbackContext).avisar;
}
