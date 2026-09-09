import type { FormHTMLAttributes } from "react";

type SettingsFormProps = FormHTMLAttributes<HTMLFormElement>;

export default function SettingsForm({ children, ...props }: SettingsFormProps) {
  return <form {...props}>{children}</form>;
}
