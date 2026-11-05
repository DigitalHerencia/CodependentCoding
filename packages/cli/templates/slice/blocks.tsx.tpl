"use client";
import Link from "next/link";
import {Input} from "@/components/ui/input";
import { {{entity}}Copy as copy } from "@/content/{{module}}";
export function {{Module}}{{Entities}}Toolbar({query,onQueryChange}:{query:string;onQueryChange:(query:string)=>void}) {return <div className="flex flex-wrap gap-3"><Input aria-label={copy.search} placeholder={copy.search} value={query} onChange={event=>onQueryChange(event.target.value)}/><Link className="type-link" href="/{{route}}/new">{copy.create}</Link></div>;}
