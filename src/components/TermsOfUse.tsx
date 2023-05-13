import React from "react";

const TermsOfUse = ({ ...props }) => {
  document.title = `Terms of Use - GARSHS`;

  return (
    <div className={`${props.className}`}>
      <h1 className="mt-0 mb-4">Terms of Use</h1>
      <small>This terms of use was last updated on May 13, 2023.</small>

      <div className="flex flex-col space-y-8 pt-7">
        <p>
          Welcome to GARSHS.com. By using our website, you agree to the
          following terms of use:
        </p>
        <section>
          <h3 className="mb-2">User Conduct</h3>{" "}
          <p>
            You agree to use our website only for lawful purposes and in a way
            that does not infringe on the rights of others. You are solely
            responsible for any content you post on our website, and you must
            not post anything that is unlawful, defamatory, obscene, or harmful.
          </p>
        </section>
        <section>
          <h3 className="mb-2">Registration</h3>{" "}
          <p>
            In order to use certain features of our website, you may be required
            to register and create an account. You must provide accurate and
            complete information when registering, and you are solely
            responsible for maintaining the confidentiality of your login
            information.
          </p>
        </section>
        <section>
          <h3 className="mb-2">Privacy</h3>{" "}
          <p>
            Our privacy policy explains how we collect and use your personal
            information. By using our website, you agree to our privacy policy.
          </p>
        </section>
        <section>
          <h3 className="mb-2">Disclaimer</h3>{" "}
          <p>
            Our website is provided "as is" and we make no warranty or
            representation of any kind, whether express or implied, including
            without limitation, any warranty of merchantability, fitness for a
            particular purpose, or non-infringement.
          </p>
        </section>
        <section>
          <h3 className="mb-2">Limitation of Liability</h3>{" "}
          <p>
            We will not be liable to you or any third-party for any damages
            arising out of your use or inability to use our website. In no event
            shall we be liable for any indirect, consequential, special,
            incidental or punitive damages.
          </p>
        </section>
        <section>
          <h3 className="mb-2">Indemnification</h3>{" "}
          <p>
            You agree to indemnify and hold us harmless from any claim or
            demand, including reasonable attorneys' fees, made by any
            third-party due to or arising out of your use of our website, your
            violation of these terms of use, or your violation of any law or the
            rights of a third-party.
          </p>
        </section>
        <section>
          <h3 className="mb-2">Changes to Terms of Use</h3>{" "}
          <p>
            We will notify users through their provided email when this terms of
            use will be updated.
          </p>
        </section>
        <section>
          <h3 className="mb-2">Governing Law</h3>{" "}
          <p>
            These terms of use shall be governed by and construed in accordance
            with the laws of the Republic of the Philippines.
          </p>
        </section>
      </div>

      <p className="pt-7">
        If you have any questions or concerns about our terms of use, please{" "}
        <a href="/contact" className="text-blue-200 hover:underline">
          contact us
        </a>
        .
      </p>
    </div>
  );
};

export default TermsOfUse;
