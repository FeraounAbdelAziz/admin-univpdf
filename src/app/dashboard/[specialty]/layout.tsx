"use client";
import { Anchor, Breadcrumbs, Container } from "@mantine/core";
import {
  createClientComponentClient,
  createServerComponentClient,
} from "@supabase/auth-helpers-nextjs";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function SpecialtyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const param = useParams();

  const supabase = createClientComponentClient();

  const [items, setItems] = useState<{ title: string; href: string }[] | []>(
    []
  );

  useEffect(() => {
    const fetchPaths = async () => {
      let { data: specialty, error } = await supabase
        .from("specialty")
        .select("specialty_name")
        .eq("specialty_id", param.specialty)
        .single();

      if (specialty) {
        if (param.module) {
          let { data, error: error_2 } = await supabase
            .from("module")
            .select("module_name")
            .eq("module_id", param.module)
            .single();

          if (data) {
            setItems((items) => [
              ...items,
              { title: data?.module_name, href: param.module as string },
            ]);
          }
        } else {
          setItems((items) => [
            {
              title: specialty.specialty_name,
              href: ("/dashboard/" + param.specialty) as string,
            },
          ]);
        }
      }
    };

    fetchPaths();
  }, [param]);

  console.log(items);

  const itemsDisplay = items.slice(0, 2).map((item, index) => (
    <Anchor component={Link} href={item.href} key={index}>
      {item.title}
    </Anchor>
  ));

  return (
    <>
      <Container mt={"md"} size={"xl"}>
        <Breadcrumbs>{itemsDisplay}</Breadcrumbs>
      </Container>
      {children}
    </>
  );
}
