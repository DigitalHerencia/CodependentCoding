"use client";

import { Button } from "@/components/ui/button";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  NativeSelect,
  NativeSelectOption,
} from "@/components/ui/native-select";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import type { ComponentProps } from "react";

export function FormButtonBlock(props: ComponentProps<typeof Button>) {
  return <Button {...props} />;
}
export function FormFieldBlock(props: ComponentProps<typeof Field>) {
  return <Field {...props} />;
}
export function FormFieldLabelBlock(props: ComponentProps<typeof FieldLabel>) {
  return <FieldLabel {...props} />;
}
export function FormFieldErrorBlock(props: ComponentProps<typeof FieldError>) {
  return <FieldError {...props} />;
}
export function FormNativeSelectBlock(
  props: ComponentProps<typeof NativeSelect>,
) {
  return <NativeSelect {...props} />;
}
export function FormNativeSelectOptionBlock(
  props: ComponentProps<typeof NativeSelectOption>,
) {
  return <NativeSelectOption {...props} />;
}
export function FormInputBlock(props: ComponentProps<typeof Input>) {
  return <Input {...props} />;
}
export function FormTextareaBlock(props: ComponentProps<typeof Textarea>) {
  return <Textarea {...props} />;
}
export function FormSeparatorBlock(props: ComponentProps<typeof Separator>) {
  return <Separator {...props} />;
}
