// import theme style scss file
import '../styles/theme.scss';
import QueryProvider from './query-provider';

export const metadata = {
    title: 'Our Thinking Admin Portal',
    description: 'Our Thinking Admin Portal',
    keywords: 'Our Thinking Admin Portal'
}

export default function RootLayout({ children }) {
    return (
        <html lang="en">
            <body className='bg-light'>
                <QueryProvider>
                {children}
                </QueryProvider>
            </body>
        </html>
    )
}
