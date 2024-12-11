import * as React from "react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Textarea } from "../ui/textarea";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { TreeDataItem, TreeView } from "../tree-view";
import {
  forwardRef,
  HTMLInputTypeAttribute,
  useImperativeHandle,
  useMemo,
} from "react";
import { z } from "zod";
import { useForm, UseFormReturn } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "../ui/input";
import { Button } from "../ui/button";

interface ConfigFormProps extends React.ButtonHTMLAttributes<HTMLDivElement> {
  formItems: Array<FormItem>;
  footer?: React.ReactNode;
  onSubmit: (formData) => void;
}
export interface ConfigFromRef {
  setFormData: (data: { [x: string]: any }) => void;
  form: UseFormReturn<
    {
      [x: string]: any;
    },
    any,
    undefined
  >;
}
interface Option<T> {
  title: string | JSX.Element;
  key: T;
}
interface FormItem {
  title?: string;
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
function Index({ formItems, onSubmit, ...props }, ref) {
  useImperativeHandle(
    ref,
    () => ({
      setFormData,
      form,
    }),
    [],
  );
  const formSchema = useMemo(() => {
    const schemaMap: Record<FormItem["key"], z.ZodSchema | undefined> = {};
    formItems.forEach((item) => {
      schemaMap[item.key] = item.rule || z.any();
    });
    return z.object(schemaMap);
  }, [formItems]);
  const defaultValues = useMemo(() => {
    const valueMap = {};
    formItems.forEach((item) => {
      valueMap[item.key] = item.defaultValue ?? null;
    });
    return valueMap;
  }, [formItems]);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  const setFormData = (data: { [x: string]: any }) => {
    Object.keys(data).forEach((key) => {
      form.setValue(key, data[key]);
    });
  };
  const getField = (item: FormItem, field) => {
    switch (item.type) {
      case "Input":
        return (
          <Input
            type={item.inputType}
            disabled={item.disabled}
            placeholder={item.placeholder ?? ""}
            {...field}
            onChange={(res) => {
              let val = res.target.value;
              field.onChange(item.inputType === "number" ? Number(val) : val);
            }}
          />
        );
      case "Select":
        return (
          <Select
            {...field}
            onValueChange={field.onChange}
            defaultValue={field.value}
            disabled={item.disabled}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder={item.placeholder ?? ""} />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {item.options.map((option) => (
                  <SelectItem value={option.key} key={item.key}>
                    {option.title}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        );
      case "Textarea":
        return (
          <Textarea
            disabled={item.disabled}
            placeholder={item.placeholder ?? ""}
            className="resize-none"
            {...field}
          />
        );
      case "RadioGroup":
        return (
          <RadioGroup
            disabled={item.disabled}
            onValueChange={field.onChange}
            defaultValue={field.value}
            className="flex gap-2"
          >
            {item.options.map((option) => (
              <FormItem
                className="flex items-center space-x-3 space-y-0"
                key={option.key}
              >
                <FormControl>
                  <RadioGroupItem value={option.key} />
                </FormControl>
                <FormLabel className="font-normal">{option.title}</FormLabel>
              </FormItem>
            ))}
          </RadioGroup>
        );
      case "TreeView":
        return (
          <div className="rounded-md border border-input px-1">
            <TreeView
              disabled={item.disabled}
              multiple={item.multiple}
              data={item.options as TreeDataItem[]}
              onSelectChange={field.onChange}
              initialSelectedItemId={field.value}
            />
          </div>
        );
    }
  };

  function submit(values: z.infer<typeof formSchema>) {
    onSubmit(values);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(submit)} className="space-y-6">
        {formItems.map((item) => {
          return (
            <FormField
              key={item.key}
              control={form.control}
              name={item.key}
              render={({ field }) => (
                <FormItem>
                  <div className="flex w-full items-center">
                    {item.title && (
                      <FormLabel className="w-1/5">{item.title}</FormLabel>
                    )}
                    <div className={`${item.title ? "w-4/5" : "w-full"}`}>
                      <FormControl>{getField(item, field)}</FormControl>
                    </div>
                  </div>
                  <FormMessage className="ml-[100px] mt-2" />
                </FormItem>
              )}
            />
          );
        })}
        {props.footer ?? (
          <FormItem>
            <Button
              variant="outline"
              type="button"
              onClick={() => form.reset()}
            >
              重置
            </Button>
            <Button type="submit">确认</Button>
          </FormItem>
        )}
      </form>
    </Form>
  );
}
export const ConfigForm = forwardRef<ConfigFromRef, ConfigFormProps>(Index);
