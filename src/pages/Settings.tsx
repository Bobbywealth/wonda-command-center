import { PageHeader, SectionHeader, Card } from "../components/Section";

export function Settings() {
  return (
    <div className="p-4 md:p-6 max-w-3xl mx-auto">
      <PageHeader title="Settings" />

      <div className="space-y-6">
        <div>
          <SectionHeader title="Profile" />
          <Card>
            <div className="flex items-center gap-4 mb-4">
              <div className="w-16 h-16 rounded-full bg-bg-elev grid place-items-center text-xl text-gold">JD</div>
              <div>
                <div className="font-medium">Jerry Duplessis</div>
                <div className="text-xs text-ink-lo">jerry@wolfpaqmarketing.com</div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div><label className="label">Display name</label><input className="input" defaultValue="Jerry Wonda" /></div>
              <div><label className="label">Timezone</label><input className="input" defaultValue="America/New_York" /></div>
            </div>
          </Card>
        </div>

        <div>
          <SectionHeader title="Connections" />
          <Card>
            <div className="space-y-3 text-sm">
              <div className="flex items-center justify-between"><span>Google Calendar</span><span className="pill bg-emerald/10 text-emerald">Connected</span></div>
              <div className="flex items-center justify-between"><span>Instagram (@princewonda)</span><span className="pill border border-line text-ink-lo">Not connected</span></div>
              <div className="flex items-center justify-between"><span>YouTube (WondaMusic)</span><span className="pill border border-line text-ink-lo">Not connected</span></div>
              <div className="flex items-center justify-between"><span>LinkedIn</span><span className="pill border border-line text-ink-lo">Not connected</span></div>
            </div>
          </Card>
        </div>

        <div>
          <SectionHeader title="Notifications" />
          <Card>
            <div className="space-y-3 text-sm">
              <label className="flex items-center justify-between"><span>Push notifications</span><input type="checkbox" defaultChecked className="accent-gold w-5 h-5" /></label>
              <label className="flex items-center justify-between"><span>Email digest</span><input type="checkbox" defaultChecked className="accent-gold w-5 h-5" /></label>
              <label className="flex items-center justify-between"><span>Overdue task alerts</span><input type="checkbox" defaultChecked className="accent-gold w-5 h-5" /></label>
            </div>
          </Card>
        </div>

        <div>
          <SectionHeader title="Finance Settings" subtitle="Owner + Finance Manager only" />
          <Card>
            <div className="grid grid-cols-2 gap-3">
              <div><label className="label">Fiscal year starts</label><select className="input"><option>January</option><option>April</option></select></div>
              <div><label className="label">Base currency</label><select className="input"><option>USD</option></select></div>
              <div><label className="label">Approval threshold</label><input className="input" defaultValue="$2,500" /></div>
              <div><label className="label">Payment terms default</label><input className="input" defaultValue="Net 30" /></div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}