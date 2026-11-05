"use client";
import {useState} from "react";
import {useRouter} from "next/navigation";
import {useForm,Controller,type FieldPath} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import type {z} from "zod";
import type { {{Entity}}DTO } from "@/types/{{module}}Types";
import {create{{Entity}},update{{Entity}}} from "@/lib/actions/{{module}}Actions";
import {create{{Entity}}Schema} from "@/schema/{{module}}Schemas";
import { {{entity}}Copy as copy } from "@/content/{{module}}";
import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";
import {Field,FieldLabel,FieldError} from "@/components/ui/field";
export function {{Entity}}NewForm({ {{entity}} }: { {{entity}}?: {{Entity}}DTO }) {
 const router=useRouter();const [error,setError]=useState("");
 const {control,handleSubmit,setError:setFieldError,formState:{isSubmitting}}=useForm<z.input<typeof create{{Entity}}Schema>,unknown,z.output<typeof create{{Entity}}Schema>>({resolver:zodResolver(create{{Entity}}Schema),defaultValues:{
{{formDefaults}}
 }});
 return <form noValidate className="mx-auto max-w-3xl space-y-5 surface-card p-5" onSubmit={handleSubmit(async values=>{
 setError("");try{const result={{entity}}?await update{{Entity}}({...values,{{param}}:{{entity}}.id,expectedVersion:{{entity}}.version}):await create{{Entity}}(values);
 if(!result.ok){for(const [name,messages]of Object.entries(result.error.fieldErrors??{}))setFieldError(name as FieldPath<z.input<typeof create{{Entity}}Schema>>,{message:messages[0]??result.error.message});setError(result.error.message);return;}
 router.push(`/{{route}}/${result.data.id}`);
 }catch{setError(copy.failed);}
 })}>
 <h1 className="type-title">{{{entity}}?copy.edit:copy.create}</h1>
{{formInputs}}
 {error&&<p role="alert">{error}</p>}
 <Button type="submit" disabled={isSubmitting}>{isSubmitting?copy.saving:{{entity}}?copy.save:copy.create}</Button>
 </form>;
}
