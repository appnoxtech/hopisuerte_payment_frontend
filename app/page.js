import React from "react";
import Link from "next/link";

export default function Home() {
  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#050506",
        color: "white",
        overflowX: "hidden",
        fontFamily: "sans-serif",
      }}
    >
      {/* Background */}
      <div
        style={{
          position: "fixed",
          inset: 0,
          pointerEvents: "none",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: "-10%",
            right: "-10%",
            width: "60%",
            height: "60%",
            background: "rgba(250,204,21,0.03)",
            borderRadius: "50%",
            filter: "blur(120px)",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: "-10%",
            left: "-10%",
            width: "60%",
            height: "60%",
            background: "rgba(234,179,8,0.02)",
            borderRadius: "50%",
            filter: "blur(150px)",
          }}
        />
        <div
          style={{
            position: "absolute",
            inset: 0,
            opacity: 0.15,
            backgroundImage:
              "radial-gradient(circle at 2px 2px, rgba(255,255,255,0.05) 1px, transparent 0)",
            backgroundSize: "48px 48px",
          }}
        />
      </div>

      {/* Navbar */}
      <nav
        style={{
          position: "sticky",
          top: 0,
          zIndex: 100,
          borderBottom: "1px solid rgba(255,255,255,0.05)",
          background: "rgba(0,0,0,0.4)",
          backdropFilter: "blur(20px)",
        }}
      >
        <div
          style={{
            maxWidth: "1400px",
            margin: "0 auto",
            padding: "20px 32px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
            <div
              style={{
                width: 40,
                height: 40,
                background: "#facc15",
                borderRadius: 10,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <span
                style={{
                  color: "black",
                  fontWeight: 900,
                  fontSize: 22,
                  fontStyle: "italic",
                }}
              >
                H
              </span>
            </div>

            <div style={{ display: "flex", flexDirection: "column" }}>
              <span
                style={{
                  fontSize: 20,
                  fontWeight: 900,
                  letterSpacing: "-0.02em",
                  fontStyle: "italic",
                }}
              >
                HopiSuerte
              </span>
              <span
                style={{
                  fontSize: 9,
                  letterSpacing: "0.4em",
                  color: "#71717a",
                  fontWeight: 900,
                  marginTop: 2,
                }}
              >
                PAYMENT SYSTEMS
              </span>
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 30 }}>
            <Link
              href="/admin/login"
              style={{
                fontSize: 10,
                fontWeight: 900,
                letterSpacing: "0.2em",
                color: "#71717a",
                textDecoration: "none",
              }}
            >
              Login
            </Link>

            <Link
              href="/admin/login"
              style={{
                background: "#facc15",
                color: "black",
                padding: "12px 28px",
                borderRadius: 10,
                fontWeight: 700,
                textDecoration: "none",
                fontSize: 12,
              }}
            >
              Open Dashboard
            </Link>
          </div>
        </div>
      </nav>

      {/* HERO */}
      <section
        style={{
          paddingTop: 120,
          paddingBottom: 160,
          paddingLeft: 32,
          paddingRight: 32,
          textAlign: "center",
          position: "relative",
          zIndex: 10,
        }}
      >
        <div
          style={{
            maxWidth: 1200,
            margin: "0 auto",
          }}
        >
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 10,
              padding: "10px 20px",
              background: "rgba(250,204,21,0.03)",
              border: "1px solid rgba(250,204,21,0.1)",
              borderRadius: 50,
              color: "#facc15",
              marginBottom: 40,
            }}
          >
            <div
              style={{
                width: 8,
                height: 8,
                borderRadius: "50%",
                background: "#facc15",
              }}
            />
            <span
              style={{
                fontSize: 10,
                letterSpacing: "0.3em",
                fontWeight: 900,
              }}
            >
              SECURE PAYMENT PROCESSING
            </span>
          </div>

          <h1
            style={{
              fontSize: 64,
              fontWeight: 900,
              lineHeight: 1,
              letterSpacing: "-0.02em",
              fontStyle: "italic",
              marginBottom: 20,
            }}
          >
            Manage Payments
            <br />
            <span
              style={{
                background:
                  "linear-gradient(90deg,#facc15,#fde68a,#eab308)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                fontStyle: "normal",
              }}
            >
              From One Dashboard.
            </span>
          </h1>

          <p
            style={{
              maxWidth: 600,
              margin: "0 auto",
              fontSize: 18,
              color: "#a1a1aa",
              lineHeight: 1.6,
            }}
          >
            Create payment links, accept global payments, and track
            transactions in real time through a secure and scalable
            platform.
          </p>

          <div
            style={{
              marginTop: 40,
              display: "flex",
              justifyContent: "center",
              gap: 20,
              flexWrap: "wrap",
            }}
          >
            <Link
              href="/admin/login"
              style={{
                background: "#facc15",
                color: "black",
                padding: "18px 40px",
                borderRadius: 12,
                fontWeight: 700,
                textDecoration: "none",
              }}
            >
              Create Payment Link
            </Link>

            <Link
              href="/admin/login"
              style={{
                border: "1px solid rgba(255,255,255,0.2)",
                color: "white",
                padding: "18px 40px",
                borderRadius: 12,
                fontWeight: 700,
                textDecoration: "none",
              }}
            >
              View Dashboard
            </Link>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section
        style={{
          padding: "0 32px 120px 32px",
          textAlign: "center",
        }}
      >
        <h3
          style={{
            fontSize: 36,
            fontWeight: 900,
            fontStyle: "italic",
            marginBottom: 10,
          }}
        >
          Core Capabilities
        </h3>

        <p
          style={{
            color: "#71717a",
            marginBottom: 60,
          }}
        >
          Everything you need to manage your merchant operations.
        </p>

        <div
          style={{
            maxWidth: 1200,
            margin: "0 auto",
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit,minmax(250px,1fr))",
            gap: 30,
          }}
        >
          {[
            {
              title: "Payment Links",
              desc: "Create unique payment links to accept payments from clients anywhere in seconds.",
            },
            {
              title: "Global Payments",
              desc: "Accept payments from multiple countries and currencies with seamless Stripe integration.",
            },
            {
              title: "Transaction Monitoring",
              desc: "Track payment status and incoming transactions in real time.",
            },
            {
              title: "Analytics Dashboard",
              desc: "View revenue, transaction history, and payment performance in one place.",
            },
          ].map((item, i) => (
            <div
              key={i}
              style={{
                background: "rgba(255,255,255,0.02)",
                border: "1px solid rgba(255,255,255,0.05)",
                borderRadius: 16,
                padding: 30,
              }}
            >
              <h4
                style={{
                  fontSize: 18,
                  fontWeight: 900,
                  marginBottom: 10,
                }}
              >
                {item.title}
              </h4>
              <p
                style={{
                  fontSize: 14,
                  color: "#a1a1aa",
                }}
              >
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* FOOTER */}
      <footer
        style={{
          borderTop: "1px solid rgba(255,255,255,0.05)",
          padding: "60px 20px",
          textAlign: "center",
          color: "#71717a",
        }}
      >
        <p style={{ fontSize: 12 }}>
          © 2026 HopiSuerte • All Rights Reserved
        </p>
      </footer>
    </main>
  );
}