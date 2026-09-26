import { Link } from "react-router-dom";
import { PageMeta } from "@/components/layout/PageMeta";
import { ErrorState } from "@/components/ui/ErrorState";
import { SkeletonTable } from "@/components/ui/Skeleton";
import { useAsync } from "@/hooks/useAsync";
import { getAdminPeople } from "@/services/api/admin";

export default function AdminUsersPage() {
  const state = useAsync(() => getAdminPeople(), []);
  return (
    <>
      <PageMeta title="People" description="Everyone on the Rentoori preview." path="/admin/users" />
      <h1 className="text-3xl font-semibold">People</h1>
      <p className="mt-1 text-sm text-muted">Community profiles plus the user, seller, and admin sign-in accounts.</p>
      {state.status === "loading" ? <div className="mt-4"><SkeletonTable /></div> : null}
      {state.status === "error" ? <div className="mt-4"><ErrorState body={state.error} onRetry={state.reload} /></div> : null}
      {state.data ? (
        <div className="mt-4 overflow-x-auto rounded-3xl border border-line">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead className="bg-brand-soft text-ink">
              <tr>
                <th className="px-4 py-3 font-semibold">Name</th>
                <th className="px-4 py-3 font-semibold">Email</th>
                <th className="px-4 py-3 font-semibold">Role</th>
                <th className="px-4 py-3 font-semibold">Area</th>
                <th className="px-4 py-3 font-semibold">Verified</th>
              </tr>
            </thead>
            <tbody>
              {state.data.map((person) => (
                <tr key={person.id} className="border-t border-line">
                  <td className="px-4 py-3 font-semibold"><Link to={`/user/${person.id}`} className="hover:text-brand">{person.name}</Link></td>
                  <td className="px-4 py-3">{person.email}</td>
                  <td className="px-4 py-3 capitalize">{person.role}</td>
                  <td className="px-4 py-3">{person.area}</td>
                  <td className="px-4 py-3">{person.verified ? "Yes" : "No"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : null}
    </>
  );
}
