type MovieRouteContext = {
  params: Promise<{ id: string }>;
};

export async function GET(_request: Request, { params }: MovieRouteContext) {
  const { id } = await params;

  return Response.json(
    { message: `Movie API for ${id} is not implemented yet.` },
    { status: 501 },
  );
}
