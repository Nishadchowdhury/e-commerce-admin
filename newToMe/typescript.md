# TypeScript record

that maps variant values to corresponding text representations.

interface ApiAlertProps {
title: string;
description: string;
variant: "public" | "admin"

}

// TypeScript record :- that maps variant values to corresponding text representations.
const textMap: Record<ApiAlertProps["variant"], string> = {
public: "Public",
admin: "Admin",
}
// textMap: This object maps each variant value to its corresponding text representation. For example, when variant is "public", it returns "Public".

const variantMap: Record<ApiAlertProps["variant"], string> = {
public: "secondary",
admin: "destructive",
}
// variantMap: This object maps each variant value to its corresponding CSS class name or style variant. For example, when variant is "admin", it returns "destructive".

// Accessing text and variant mappings based on the variant prop
// const variant = "public";
// console.log(textMap[variant]); // Output: "Public"
// console.log(variantMap[variant]); // Output: "secondary"
