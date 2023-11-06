export type FCC<P> = React.FC<{ children?: React.ReactNode } & P>;
export type FcDivProps<P> = React.HTMLAttributes<HTMLDivElement> & P;
export type FcDiv<P> = FCC<FcDivProps<P>>;
