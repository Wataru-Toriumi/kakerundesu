import { Statusbar } from "@/components/app/Statusbar";

type FooterProps = {
  isDirty: boolean;
  message: string;
};

export function Footer({ isDirty, message }: FooterProps) {
  return <Statusbar isDirty={isDirty} message={message} />;
}
