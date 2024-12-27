"use client";

import React, { ReactElement, ReactNode, useEffect } from "react";
import * as AccordionPrimitive from "@radix-ui/react-accordion";
import { ChevronRight } from "lucide-react";
import { cva } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { Checkbox } from "./ui/checkbox";

const treeVariants = cva(
  "group hover:before:opacity-100 before:absolute before:rounded-lg before:left-0 px-2 before:w-full before:opacity-0 before:bg-accent/70 before:h-[2rem] before:-z-10",
);

const selectedTreeVariants = cva(
  "before:opacity-100 before:bg-accent/70 text-accent-foreground",
);
export type IconComponent = React.FC<React.SVGProps<SVGSVGElement>>;
interface TreeDataItem {
  id: string;
  name: string;
  icon?: IconComponent;
  selectedIcon?: IconComponent;
  openIcon?: IconComponent;
  children?: TreeDataItem[];
  actions?: React.ReactNode;
  onClick?: () => void;
}

type TreeProps = React.HTMLAttributes<HTMLDivElement> & {
  data: TreeDataItem[] | TreeDataItem;
  initialSelectedItemId?: string[];
  onSelectChange?: (item: string[] | undefined) => void;
  expandAll?: boolean;
  defaultNodeIcon?: IconComponent;
  defaultLeafIcon?: IconComponent;
  multiple?: boolean;
  disabled?: boolean;
};

const TreeView = React.forwardRef<HTMLDivElement, TreeProps>(
  (
    {
      data,
      initialSelectedItemId = [],
      onSelectChange,
      expandAll,
      defaultLeafIcon,
      defaultNodeIcon,
      className,
      multiple,
      disabled,
      ...props
    },
    ref,
  ) => {
    const [selectedItemId, setSelectedItemId] = React.useState<
      string[] | undefined
    >(initialSelectedItemId);

    useEffect(() => {
      setSelectedItemId(initialSelectedItemId);
    }, [initialSelectedItemId]);

    const handleSelectChange = React.useCallback(
      (item: TreeDataItem | undefined) => {
        let selectedItems: string[] = [];
        if (initialSelectedItemId.includes(item?.id)) {
          selectedItems = initialSelectedItemId.filter((id) => id != item.id);
        } else {
          selectedItems = multiple
            ? [...initialSelectedItemId, item?.id]
            : [item?.id];
        }
        if (onSelectChange && !disabled) {
          onSelectChange(selectedItems);
        }
      },
      [onSelectChange],
    );

    const expandedItemIds = React.useMemo(() => {
      if (!initialSelectedItemId) {
        return [] as string[];
      }

      const ids: string[] = [];

      function walkTreeItems(
        items: TreeDataItem[] | TreeDataItem,
        targetId: string,
      ) {
        if (items instanceof Array) {
          for (let i = 0; i < items.length; i++) {
            ids.push(items[i]!.id);
            if (walkTreeItems(items[i]!, targetId) && !expandAll) {
              return true;
            }
            if (!expandAll) ids.pop();
          }
        } else if (!expandAll && items.id === targetId) {
          return true;
        } else if (items.children) {
          return walkTreeItems(items.children, targetId);
        }
      }

      walkTreeItems(data, initialSelectedItemId[0]);
      return ids;
    }, [data, expandAll, initialSelectedItemId]);

    return (
      <div className={cn("relative overflow-hidden p-2", className)}>
        <TreeItem
          data={data}
          ref={ref}
          selectedItemId={initialSelectedItemId}
          handleSelectChange={handleSelectChange}
          expandedItemIds={expandedItemIds}
          defaultLeafIcon={defaultLeafIcon}
          defaultNodeIcon={defaultNodeIcon}
          {...props}
        />
      </div>
    );
  },
);
TreeView.displayName = "TreeView";

type TreeItemProps = TreeProps & {
  selectedItemId?: string[];
  handleSelectChange: (item: TreeDataItem | undefined) => void;
  expandedItemIds: string[];
  defaultNodeIcon?: IconComponent;
  defaultLeafIcon?: IconComponent;
};

const TreeItem = React.forwardRef<HTMLDivElement, TreeItemProps>(
  (
    {
      className,
      data,
      selectedItemId,
      handleSelectChange,
      expandedItemIds,
      defaultNodeIcon,
      defaultLeafIcon,
      ...props
    },
    ref,
  ) => {
    if (!(data instanceof Array)) {
      data = [data];
    }
    return (
      <div ref={ref} role="tree" className={className} {...props}>
        <ul>
          {data.map((item) => (
            <li key={item.id}>
              {item.children ? (
                <TreeNode
                  item={item}
                  selectedItemId={selectedItemId}
                  expandedItemIds={expandedItemIds}
                  handleSelectChange={handleSelectChange}
                  defaultNodeIcon={defaultNodeIcon}
                  defaultLeafIcon={defaultLeafIcon}
                />
              ) : (
                <TreeLeaf
                  item={item}
                  selectedItemId={selectedItemId}
                  handleSelectChange={handleSelectChange}
                  defaultLeafIcon={defaultLeafIcon}
                />
              )}
            </li>
          ))}
        </ul>
      </div>
    );
  },
);
TreeItem.displayName = "TreeItem";

const TreeNode = ({
  item,
  handleSelectChange,
  expandedItemIds,
  selectedItemId,
  defaultNodeIcon,
  defaultLeafIcon,
}: {
  item: TreeDataItem;
  handleSelectChange: (item: TreeDataItem | undefined) => void;
  expandedItemIds: string[];
  selectedItemId?: string[];
  defaultNodeIcon?: IconComponent;
  defaultLeafIcon?: IconComponent;
}) => {
  const [value, setValue] = React.useState(
    expandedItemIds.includes(item.id) ? [item.id] : [],
  );
  return (
    <AccordionPrimitive.Root
      type="multiple"
      value={value}
      onValueChange={(s) => setValue(s)}
    >
      <AccordionPrimitive.Item value={item.id}>
        <AccordionTrigger
          className={cn(
            treeVariants(),
            // selectedItemId.includes(item.id) && selectedTreeVariants(),
          )}
          onClick={() => {
            // handleSelectChange(item);
            item.onClick?.();
          }}
        >
          <TreeIcon
            item={item}
            handleSelectChange={handleSelectChange}
            isSelected={selectedItemId.includes(item.id)}
            isOpen={value.includes(item.id)}
            default={defaultNodeIcon}
          />
          <span className="truncate text-sm">{item.name}</span>
          <TreeActions isSelected={selectedItemId.includes(item.id)}>
            {item.actions}
          </TreeActions>
        </AccordionTrigger>
        <AccordionContent className="ml-4 border-l pl-1">
          <TreeItem
            data={item.children ? item.children : item}
            selectedItemId={selectedItemId}
            handleSelectChange={handleSelectChange}
            expandedItemIds={expandedItemIds}
            defaultLeafIcon={defaultLeafIcon}
            defaultNodeIcon={defaultNodeIcon}
          />
        </AccordionContent>
      </AccordionPrimitive.Item>
    </AccordionPrimitive.Root>
  );
};

const TreeLeaf = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    item: TreeDataItem;
    selectedItemId?: string[];
    handleSelectChange: (item: TreeDataItem | undefined) => void;
    defaultLeafIcon?: IconComponent;
  }
>(
  (
    {
      className,
      item,
      selectedItemId,
      handleSelectChange,
      defaultLeafIcon,
      ...props
    },
    ref,
  ) => {
    return (
      <div
        ref={ref}
        className={cn(
          "ml-5 flex cursor-pointer items-center py-2 text-left before:right-1",
          treeVariants(),
          className,
          // selectedItemId.includes(item.id) && selectedTreeVariants(),
        )}
        onClick={() => {
          item.onClick?.();
        }}
        {...props}
      >
        <TreeIcon
          item={item}
          handleSelectChange={handleSelectChange}
          isSelected={selectedItemId.includes(item.id)}
          default={defaultLeafIcon}
        />
        <span className="flex-grow truncate text-sm">{item.name}</span>
        <TreeActions isSelected={selectedItemId.includes(item.id)}>
          {item.actions}
        </TreeActions>
      </div>
    );
  },
);
TreeLeaf.displayName = "TreeLeaf";

const AccordionTrigger = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Trigger>
>(({ className, children, ...props }, ref) => (
  <AccordionPrimitive.Header>
    <AccordionPrimitive.Trigger
      ref={ref}
      className={cn(
        "flex w-full flex-1 items-center py-2 transition-all first:[&[data-state=open]>svg]:rotate-90",
        className,
      )}
      {...props}
    >
      <ChevronRight className="mr-1 h-4 w-4 shrink-0 text-accent-foreground/50 transition-transform duration-200" />
      {children}
    </AccordionPrimitive.Trigger>
  </AccordionPrimitive.Header>
));
AccordionTrigger.displayName = AccordionPrimitive.Trigger.displayName;

const AccordionContent = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Content>
>(({ className, children, ...props }, ref) => (
  <AccordionPrimitive.Content
    ref={ref}
    className={cn(
      "data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down overflow-hidden text-sm transition-all",
      className,
    )}
    {...props}
  >
    <div className="pb-1 pt-0">{children}</div>
  </AccordionPrimitive.Content>
));
AccordionContent.displayName = AccordionPrimitive.Content.displayName;
const TreeIcon = ({
  item,
  isOpen,
  isSelected,
  default: defaultIcon,
  handleSelectChange,
}: {
  item: TreeDataItem;
  isOpen?: boolean;
  isSelected?: boolean;
  default?: IconComponent;
  handleSelectChange: (item: TreeDataItem | undefined) => void;
}) => {
  let Icon: IconComponent = defaultIcon;
  if (isSelected && item.selectedIcon) {
    Icon = item.selectedIcon;
  } else if (isOpen && item.openIcon) {
    Icon = item.openIcon;
  } else if (item.icon) {
    Icon = item.icon;
  }
  return Icon ? (
    <Icon
      className="mr-2 h-4 w-4 shrink-0"
      onClick={(e: React.MouseEvent) => {
        e.preventDefault();
        handleSelectChange(item);
      }}
    />
  ) : (
    <Checkbox
      asChild
      checked={isSelected}
      className="mr-2 h-4 w-4 shrink-0"
      onClick={(e) => {
        e.preventDefault();
        handleSelectChange(item);
      }}
    />
  );
};

const TreeActions = ({
  children,
  isSelected,
}: {
  children: React.ReactNode;
  isSelected: boolean;
}) => {
  return (
    <div
      className={cn(
        isSelected ? "block" : "hidden",
        "absolute right-3 group-hover:block",
      )}
    >
      {children}
    </div>
  );
};

export { TreeView, type TreeDataItem };
