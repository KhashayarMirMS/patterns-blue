import {
    Links, LinksFunction, LiveReload, LoaderFunction, Meta, Scripts,
    ScrollRestoration,
    useCatch, useLoaderData
} from 'remix';
import globalStylesUrl from '~/styles/dist/global.css';
import Layout from './components/Layout';


// https://remix.run/api/app#links
export const links: LinksFunction = () => [{ rel: 'stylesheet', href: globalStylesUrl }, ];

export const loader: LoaderFunction = () => ({
    env: {
        SUPABASE_URL: process.env.SUPABASE_URL,
        PUBLIC_SUPABASE_ANON_KEY: process.env.PUBLIC_SUPABASE_ANON_KEY,
    },
});

// https://remix.run/api/conventions#default-export
// https://remix.run/api/conventions#route-filenames
export default function App() {
    return (
        <Document>
            <Layout />
        </Document>
    );
}

// https://remix.run/docs/en/v1/api/conventions#errorboundary
export function ErrorBoundary({ error }: { error: Error }) {
    console.error(error);
    return (
        <Document title="Error!">
            <div>
                <h1>There was an error</h1>
                <p>{error.message}</p>
                <hr />
                <p>
                    Hey, developer, you should replace this with what you want your
                    users to see.
                </p>
            </div>
        </Document>
    );
}

// https://remix.run/docs/en/v1/api/conventions#catchboundary
export function CatchBoundary() {
    const caught = useCatch();

    let message;
    switch (caught.status) {
        case 401:
            message = (
                <p>
                    Oops! Looks like you tried to visit a page that you do not have access
                    to.
                </p>
            );
            break;
        case 404:
            message = (
                <p>Oops! Looks like you tried to visit a page that does not exist.</p>
            );
            break;

        default:
            throw new Error(caught.data || caught.statusText);
    }

    return (
        <Document title={`${caught.status} ${caught.statusText}`}>
            <h1>
                {caught.status}: {caught.statusText}
            </h1>
            {message}
        </Document>
    );
}

function Document({
    children,
    title
}: {
    children: React.ReactNode;
    title?: string;
}) {

    const { env } = useLoaderData<Window>();

    return (
        <html lang="en">
            <head>
                <meta charSet="utf-8" />
                <meta name="viewport" content="width=device-width,initial-scale=1" />
                {title ? <title>{title}</title> : null}
                <Meta />
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
                {/* eslint-disable-next-line max-len */}
                <link href="https://fonts.googleapis.com/css2?family=Noto+Serif+Display:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&family=Noto+Serif:ital,wght@0,400;0,700;1,400;1,700&display=swap" rel="stylesheet" />
                <link rel="icon" type="image/png" sizes="96x96" href="/favicon.png" />
                <Links />
            </head>
            <body>
                {children}
                <ScrollRestoration />
                <script
                    dangerouslySetInnerHTML={{
                        __html: `window.env = ${JSON.stringify(env,)}`,
                    }}
                />
                <Scripts />
                {process.env.NODE_ENV === 'development' && <LiveReload />}
            </body>
        </html>
    );
}

