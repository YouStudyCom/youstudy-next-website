import { NextRequest, NextResponse } from 'next/server'

export function middleware(req: NextRequest) {
    const url = req.nextUrl.clone()

    const host = req.headers.get('host') || ''
    const proto = req.headers.get('x-forwarded-proto')

    // Prevent redirect loops on localhost
    if (host.includes('localhost') || host.includes('127.0.0.1')) {
        return NextResponse.next()
    }

    /**
     * 1. Force HTTPS
     */
    if (proto === 'http') {
        url.protocol = 'https:'
        return NextResponse.redirect(url, 301)
    }

    /**
     * 2. Force WWW version (SEO canonical)
     */
    if (!host.startsWith('www.')) {
        url.host = `www.${host}`
        return NextResponse.redirect(url, 301)
    }

    return NextResponse.next()
}
