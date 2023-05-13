import React from "react";

const PrivacyPolicy = ({ ...props }) => {
  document.title = `Privacy Policy - GARSHS`;

  return (
    <div className={`${props.className} `}>
      <h1 className="mt-0 mb-4">Privacy Policy</h1>
      <small>This privacy policy was last updated on May 13, 2023.</small>
      <div className="flex flex-col space-y-8 pt-7">
        <p>
          At our GARSHS.com, protecting your privacy is of utmost importance. We
          understand that your personal information is important and we want you
          to be safe and secure when you use our website.
        </p>
        <section>
          <h3 className="mb-2">Information We Collect</h3>
          <p>
            When you sign up for our website, we will ask you to provide some
            basic information such as your first name, last name, and email
            address. If you choose to provide additional information about
            yourself on our website, such as your personal information, health
            information, contact information, or education information, this
            information will be optional.
          </p>
        </section>
        <section>
          <h3 className="mb-2">How We Use Your Information</h3>
          <p>
            We will only use your basic information to verify your identity and
            provide you with access to the features and services of our website.
            We will not share your personal information with any third-party
            without your consent. If you choose to provide additional
            information about yourself, this information will only be used to
            enhance your experience on our website and we will not use this
            information for any other purposes without your consent.
          </p>
        </section>

        <section>
          <h3 className="mb-2">Analytics and Cookies</h3>
          <p>
            We do not use any third-party analytics programs that may collect
            information about your browsing behavior. We also do not use
            cookies. Cookies are small files that are stored on your device when
            you access a website, and they are made to remember your preferences
            and settings.
          </p>
        </section>
        <section>
          <h3 className="mb-2">Security and Data Retention</h3>
          <p>
            We take the security of your personal information very seriously,
            and we have implemented a variety of security measures to protect
            your information from unauthorized access, use, or disclosure. We
            will retain your personal information only for as long as necessary
            to provide you with access to the features and services of our
            website. Should you wish to stop using the website and you want all
            of your data to be deleted, you can do so by going into your{" "}
            <a
              href="/dashboard/profile"
              target="_blank"
              className="text-blue-200 hover:underline"
            >
              profile
            </a>{" "}
            and then click 'Delete My Account and All of My Data'.
          </p>
        </section>
        <section>
          <h3 className="mb-2">Contact Us</h3>
          <p>
            If you have any questions or concerns about our privacy policy,
            please don't hesitate to{" "}
            <a href="/contact" className="text-blue-200 hover:underline">
              contact us
            </a>
            .
          </p>
        </section>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
