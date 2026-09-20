// @vitest-environment jsdom
import React from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
const auth = vi.hoisted(() => ({
  getSession: vi.fn(),
  onAuthStateChange: vi.fn(),
  updateUser: vi.fn(),
  signOut: vi.fn(),
}));
vi.mock("../src/lib/supabase", () => ({ supabase: { auth } }));
import ResetPasswordPage from "../src/pages/reset-password/page";
afterEach(cleanup);
beforeEach(() => {
  vi.clearAllMocks();
  auth.onAuthStateChange.mockReturnValue({
    data: { subscription: { unsubscribe: vi.fn() } },
  });
  auth.getSession.mockResolvedValue({
    data: { session: { access_token: "test" } },
    error: null,
  });
  auth.updateUser.mockResolvedValue({ error: null });
  auth.signOut.mockResolvedValue({ error: null });
});
describe("password recovery UI", () => {
  it("sets the new password through Auth and signs out all sessions after success", async () => {
    render(
      <MemoryRouter>
        <ResetPasswordPage />
      </MemoryRouter>,
    );
    fireEvent.change(await screen.findByLabelText("Нова парола"), {
      target: { value: "a-long-test-password" },
    });
    fireEvent.change(screen.getByLabelText("Повтори паролата"), {
      target: { value: "a-long-test-password" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Запази паролата" }));
    await screen.findByText("Паролата е сменена успешно.");
    expect(auth.updateUser).toHaveBeenCalledWith({
      password: "a-long-test-password",
    });
    expect(auth.signOut).toHaveBeenCalledWith({ scope: "global" });
  });
  it("rejects mismatched confirmation before calling Auth", async () => {
    render(
      <MemoryRouter>
        <ResetPasswordPage />
      </MemoryRouter>,
    );
    fireEvent.change(await screen.findByLabelText("Нова парола"), {
      target: { value: "a-long-test-password" },
    });
    fireEvent.change(screen.getByLabelText("Повтори паролата"), {
      target: { value: "different-password" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Запази паролата" }));
    expect((await screen.findByRole("alert")).textContent).toContain(
      "не съвпадат",
    );
    expect(auth.updateUser).not.toHaveBeenCalled();
  });
  it("does not render a password form for an expired recovery session", async () => {
    auth.getSession.mockResolvedValue({
      data: { session: null },
      error: Error("expired"),
    });
    render(
      <MemoryRouter>
        <ResetPasswordPage />
      </MemoryRouter>,
    );
    await waitFor(() =>
      expect(screen.getByRole("alert").textContent).toContain("изтекъл")
    );
    expect(screen.queryByLabelText("Нова парола")).toBeNull();
  });
  it("keeps the form open if Auth rejects the password", async () => {
    auth.updateUser.mockResolvedValue({ error: Error("weak password") });
    render(
      <MemoryRouter>
        <ResetPasswordPage />
      </MemoryRouter>,
    );
    fireEvent.change(await screen.findByLabelText("Нова парола"), {
      target: { value: "a-long-test-password" },
    });
    fireEvent.change(screen.getByLabelText("Повтори паролата"), {
      target: { value: "a-long-test-password" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Запази паролата" }));
    await waitFor(() =>
      expect(screen.getByRole("alert").textContent).toContain("не беше сменена")
    );
    expect(auth.signOut).not.toHaveBeenCalled();
  });
});
