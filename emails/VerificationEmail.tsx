import {
  Html,
  Head,
  Font,
  Preview,
  Heading,
  Row,
  Section,
  Text,
  Button,
} from "@react-email/components";

interface VerificationEmailProps {
  usernames: string;
  otp: string;
}

export default function VerificationEmail({
  usernames,
  otp,
}: VerificationEmailProps) {
  return (
    <Html lang="en">
      <Head>
        <title>Verification Code</title>
        <Font
          fontFamily="Roboto"
          fallbackFontFamily="Verdana"
          webFont={{
            url: "https://fonts.gstatic.com/s/roboto/v20/KFOmCnqEu92Fr1Mu4mxP.woff2",
            format: "woff2",
          }}
          fontWeight={400}
          fontStyle="normal"
        />
      </Head>
      <Preview> Here&apos; s your Verification code: {otp}</Preview>
      <Section>
        <Row>
          <Heading>Thank you for registering with us!</Heading>
          <Text>We&apos;re happy to have you on board!</Text>
        </Row>
        <Row>
          <Text>{otp}</Text>
        </Row>
        <Row>
          <Text>if you did not request this code, please igone this email</Text>
        </Row>
      </Section>
    </Html>
  );
}
