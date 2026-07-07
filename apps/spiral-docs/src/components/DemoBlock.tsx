import { Typography } from "@aviala-design/spiral";

import type { ReactNode } from "react";

import { LiveDemo } from "./LiveDemo";

import type { KnobDef, KnobValues } from "./DemoKnobs";



type DemoBlockProps = {

  title?: string;

  /** Static preview (legacy) */

  children?: ReactNode;

  /** Live Monaco playground */

  initialCode?: string;

  scope?: Record<string, unknown>;

  knobs?: KnobDef[];

  buildCode?: (values: KnobValues) => string;

};



export function DemoBlock({

  title = "代码演示",

  children,

  initialCode,

  scope,

  knobs,

  buildCode,

}: DemoBlockProps) {

  const isLive = Boolean(initialCode && scope);



  return (

    <section className="docs-demo">

      <Typography level="title" as="h2">

        {title}

      </Typography>

      {isLive ? (

        <LiveDemo

          initialCode={initialCode!}

          scope={scope!}

          knobs={knobs}

          buildCode={buildCode}

        />

      ) : (

        <div className="docs-demo-surface">{children}</div>

      )}

    </section>

  );

}


