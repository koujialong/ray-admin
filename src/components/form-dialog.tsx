"use client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { DialogProps } from "@radix-ui/react-dialog";
import { z } from "zod";
import {
  forwardRef,
  HTMLInputTypeAttribute,
  useImperativeHandle,
  useRef,
} from "react";
import { TreeDataItem } from "./tree-view";
import { ConfigForm, ConfigFromRef } from "./form/config-form";

interface Option<T> {
  title: string | JSX.Element;
  key: T;
}

interface FormItem {
  title: string;
  key: string;
  type: "Input" | "Select" | "RadioGroup" | "Textarea" | "TreeView";
  inputType?: HTMLInputTypeAttribute;
  placeholder?: string;
  rule?: z.ZodSchema;
  defaultValue?: string | number | [];
  options?: Option<string>[] | TreeDataItem[];
  multiple?: boolean;
  disabled?: boolean;
}

interface FromDialogProps extends DialogProps {
  title: string;
  open: boolean;
  formItems: Array<FormItem>;
  setOpen: (open: boolean) => void;
  onSubmit: (formData) => void;
}

export interface FromDialogRef<> {
  setFormData: (data: { [x: string]: any }) => void;
}

function Index(
  { title, open, formItems, setOpen, onSubmit }: FromDialogProps,
  ref,
) {
  const configFormRef = useRef<ConfigFromRef>(null);
  useImperativeHandle(
    ref,
    () => ({
      setFormData: (data) => configFormRef.current?.setFormData(data),
    }),
    [],
  );

  function submit(values) {
    onSubmit(values);
    onOpenChange(false);
  }

  const onOpenChange = (open: boolean) => {
    setOpen(open);
    configFormRef.current.form?.reset();
    configFormRef.current.form?.clearErrors();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <ConfigForm
          ref={configFormRef}
          formItems={formItems}
          onSubmit={submit}
          footer={
            <DialogFooter>
              <Button
                variant="outline"
                type="button"
                onClick={() => onOpenChange(false)}
              >
                取消
              </Button>
              <Button type="submit">确认</Button>
            </DialogFooter>
          }
        />
      </DialogContent>
    </Dialog>
  );
}

export const FormDialog = forwardRef<FromDialogRef, FromDialogProps>(Index);
