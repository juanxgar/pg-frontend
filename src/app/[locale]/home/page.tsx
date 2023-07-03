interface Props {
  params: { locale: string };
}

export default function Page(props: Props) {
  const { params } = props;
  return <div>{params.locale === "es" ? "pagina inicio" : "home page"}</div>;
}
