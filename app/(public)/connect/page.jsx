import Connect from '@/components/Connect';
import Footer from '@/components/footer';

export const metadata = {
    title: "Connect",
    description:
        "Get in touch with TrendyStory for collaborations, partnerships, and AI workflow support.",
    alternates: {
        canonical: "/connect",
    },
};

export default function ConnectUs() {
    return (
        <>
            {/* <Navbar isScrolled={false} /> */}
            <Connect />
            <Footer />
        </>
    )
}
