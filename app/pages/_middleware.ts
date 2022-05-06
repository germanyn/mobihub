import { NextResponse, NextMiddleware } from 'next/server'
export const middleware: NextMiddleware = (req) => {
    const { pathname, origin } = req.nextUrl
    if (pathname == '/') {
        return NextResponse.redirect(`${origin}/ofertas?modalidade=venda`)
    }
    return NextResponse.next()
}