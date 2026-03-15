import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import {
  Loader2,
  LogOut,
  Pencil,
  Plus,
  Shield,
  Trash2,
  Watch,
} from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import type { Specs } from "../backend";
import { useActor } from "../hooks/useActor";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import { formatINR } from "../utils/currency";

type Category = "Dress" | "Sport" | "Dive" | "Chronograph" | "Vintage";

interface WatchRow {
  id: bigint;
  name: string;
  brand: string;
  category: string;
  price: bigint;
  image: string;
  description: string;
  specs: Specs;
}

interface WatchForm {
  name: string;
  brand: string;
  category: Category;
  price: string;
  image: string;
  description: string;
  caseSize: string;
  material: string;
  waterResistance: string;
  movement: string;
  crystal: string;
  strap: string;
}

const emptyForm: WatchForm = {
  name: "",
  brand: "Denseverse",
  category: "Dress",
  price: "",
  image: "",
  description: "",
  caseSize: "",
  material: "",
  waterResistance: "",
  movement: "",
  crystal: "",
  strap: "",
};

function watchToForm(w: WatchRow): WatchForm {
  return {
    name: w.name,
    brand: w.brand,
    category: w.category as Category,
    price: w.price.toString(),
    image: w.image,
    description: w.description,
    caseSize: w.specs.caseSize,
    material: w.specs.material,
    waterResistance: w.specs.waterResistance,
    movement: w.specs.movement,
    crystal: w.specs.crystal,
    strap: w.specs.strap,
  };
}

export function AdminPage() {
  const { login, clear, identity, isInitializing, isLoggingIn } =
    useInternetIdentity();
  const { actor, isFetching: actorFetching } = useActor();

  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [watches, setWatches] = useState<WatchRow[]>([]);
  const [loading, setLoading] = useState(false);

  const [formOpen, setFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<bigint | null>(null);
  const [form, setForm] = useState<WatchForm>(emptyForm);
  const [saving, setSaving] = useState(false);

  const [deleteId, setDeleteId] = useState<bigint | null>(null);
  const [deleting, setDeleting] = useState(false);

  const isLoggedIn = !!identity;

  // Check admin role whenever actor is ready and user is logged in
  useEffect(() => {
    if (!actor || actorFetching || !isLoggedIn) {
      if (!isLoggedIn) setIsAdmin(null);
      return;
    }
    actor
      .isCallerAdmin()
      .then((result) => setIsAdmin(result))
      .catch(() => setIsAdmin(false));
  }, [actor, actorFetching, isLoggedIn]);

  // Load watches when admin is confirmed
  useEffect(() => {
    if (!isAdmin || !actor) return;
    loadWatches();
  }, [isAdmin, actor]);

  const loadWatches = async () => {
    if (!actor) return;
    setLoading(true);
    try {
      const result = await actor.getWatches();
      setWatches(result as WatchRow[]);
    } catch {
      toast.error("Failed to load watches");
    } finally {
      setLoading(false);
    }
  };

  const openAdd = () => {
    setEditingId(null);
    setForm(emptyForm);
    setFormOpen(true);
  };

  const openEdit = (w: WatchRow) => {
    setEditingId(w.id);
    setForm(watchToForm(w));
    setFormOpen(true);
  };

  const handleSave = async () => {
    if (!actor) return;
    if (!form.name.trim() || !form.price.trim() || !form.brand.trim()) {
      toast.error("Name, brand, and price are required");
      return;
    }
    setSaving(true);
    try {
      const specs: Specs = {
        caseSize: form.caseSize,
        material: form.material,
        waterResistance: form.waterResistance,
        movement: form.movement,
        crystal: form.crystal,
        strap: form.strap,
      };
      const price = BigInt(Math.round(Number(form.price)));
      if (editingId !== null) {
        await actor.updateWatch(
          editingId,
          form.name,
          form.brand,
          form.category,
          price,
          form.image,
          form.description,
          specs,
        );
        toast.success("Watch updated successfully");
      } else {
        await actor.addWatch(
          form.name,
          form.brand,
          form.category,
          price,
          form.image,
          form.description,
          specs,
        );
        toast.success("Watch added successfully");
      }
      setFormOpen(false);
      await loadWatches();
    } catch {
      toast.error("Failed to save watch");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!actor || deleteId === null) return;
    setDeleting(true);
    try {
      await actor.deleteWatch(deleteId);
      toast.success("Watch deleted");
      setDeleteId(null);
      await loadWatches();
    } catch {
      toast.error("Failed to delete watch");
    } finally {
      setDeleting(false);
    }
  };

  const setField = (key: keyof WatchForm, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  // ── Login screen ──────────────────────────────────────────────────────────────
  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-6">
        <div
          data-ocid="admin.panel"
          className="w-full max-w-md bg-card border border-border p-10 text-center"
        >
          <Shield className="w-12 h-12 text-gold mx-auto mb-6" />
          <h1 className="font-display text-2xl font-bold text-foreground mb-2">
            Admin Access
          </h1>
          <p className="font-body text-sm text-muted-foreground mb-8">
            Sign in with Internet Identity to manage the denseverse.in store.
          </p>
          <Button
            data-ocid="admin.primary_button"
            onClick={login}
            disabled={isInitializing || isLoggingIn}
            className="w-full gold-gradient text-primary-foreground font-body font-semibold border-0"
          >
            {isLoggingIn ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Signing in…
              </>
            ) : (
              "Sign in with Internet Identity"
            )}
          </Button>
          <a
            href="/"
            className="block mt-6 font-body text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            ← Back to store
          </a>
        </div>
      </div>
    );
  }

  // ── Checking admin role ───────────────────────────────────────────────────────
  if (isAdmin === null) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div
          data-ocid="admin.loading_state"
          className="flex flex-col items-center gap-4"
        >
          <Loader2 className="w-8 h-8 animate-spin text-gold" />
          <p className="font-body text-sm text-muted-foreground">
            Verifying access…
          </p>
        </div>
      </div>
    );
  }

  // ── Access denied ────────────────────────────────────────────────────────────
  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-6">
        <div
          data-ocid="admin.error_state"
          className="w-full max-w-md bg-card border border-border p-10 text-center"
        >
          <Shield className="w-12 h-12 text-destructive mx-auto mb-6" />
          <h1 className="font-display text-2xl font-bold text-foreground mb-2">
            Access Denied
          </h1>
          <p className="font-body text-sm text-muted-foreground mb-8">
            You need admin role to access this panel.
          </p>
          <div className="flex gap-3 justify-center">
            <Button
              variant="outline"
              onClick={clear}
              className="font-body border-border"
            >
              Sign out
            </Button>
            <a href="/">
              <Button className="font-body gold-gradient text-primary-foreground border-0">
                Back to Store
              </Button>
            </a>
          </div>
        </div>
      </div>
    );
  }

  // ── Admin dashboard ───────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Watch className="w-5 h-5 text-gold" />
            <h1 className="font-display text-xl font-semibold text-foreground">
              Admin — <span className="text-gold">Watch Manager</span>
            </h1>
          </div>
          <div className="flex items-center gap-3">
            <a
              href="/"
              className="font-body text-xs text-muted-foreground hover:text-foreground transition-colors hidden sm:block"
            >
              ← Storefront
            </a>
            <Button
              data-ocid="admin.secondary_button"
              variant="outline"
              size="sm"
              onClick={clear}
              className="font-body border-border text-muted-foreground hover:text-foreground gap-2"
            >
              <LogOut className="w-4 h-4" />
              Sign out
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {/* Actions bar */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="font-display text-2xl font-bold text-foreground">
              Watches
            </h2>
            <p className="font-body text-sm text-muted-foreground mt-0.5">
              {watches.length} timepiece{watches.length !== 1 ? "s" : ""} in
              catalogue
            </p>
          </div>
          <Button
            data-ocid="admin.primary_button"
            onClick={openAdd}
            className="gold-gradient text-primary-foreground font-body font-semibold border-0 gap-2"
          >
            <Plus className="w-4 h-4" />
            Add New Watch
          </Button>
        </div>

        {/* Table */}
        {loading ? (
          <div
            data-ocid="admin.loading_state"
            className="flex items-center justify-center py-24"
          >
            <Loader2 className="w-8 h-8 animate-spin text-gold" />
          </div>
        ) : watches.length === 0 ? (
          <div
            data-ocid="admin.empty_state"
            className="text-center py-24 bg-card border border-border"
          >
            <Watch className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
            <p className="font-display text-xl text-muted-foreground/60">
              No watches yet
            </p>
            <p className="font-body text-sm text-muted-foreground/40 mt-2">
              Add your first timepiece to get started
            </p>
          </div>
        ) : (
          <div className="bg-card border border-border overflow-hidden">
            <Table data-ocid="admin.table">
              <TableHeader>
                <TableRow className="border-border hover:bg-transparent">
                  <TableHead className="font-body text-xs text-muted-foreground uppercase tracking-wider w-16">
                    Image
                  </TableHead>
                  <TableHead className="font-body text-xs text-muted-foreground uppercase tracking-wider">
                    Name
                  </TableHead>
                  <TableHead className="font-body text-xs text-muted-foreground uppercase tracking-wider hidden md:table-cell">
                    Brand
                  </TableHead>
                  <TableHead className="font-body text-xs text-muted-foreground uppercase tracking-wider hidden lg:table-cell">
                    Category
                  </TableHead>
                  <TableHead className="font-body text-xs text-muted-foreground uppercase tracking-wider">
                    Price
                  </TableHead>
                  <TableHead className="font-body text-xs text-muted-foreground uppercase tracking-wider text-right">
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {watches.map((w, idx) => (
                  <TableRow
                    key={w.id.toString()}
                    data-ocid={`admin.row.${idx + 1}`}
                    className="border-border hover:bg-secondary/50 transition-colors"
                  >
                    <TableCell>
                      <div className="w-12 h-12 overflow-hidden bg-muted">
                        {w.image ? (
                          <img
                            src={w.image}
                            alt={w.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <Watch className="w-5 h-5 text-muted-foreground/30" />
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <p className="font-display text-sm font-semibold text-foreground">
                        {w.name}
                      </p>
                    </TableCell>
                    <TableCell className="hidden md:table-cell font-body text-sm text-muted-foreground">
                      {w.brand}
                    </TableCell>
                    <TableCell className="hidden lg:table-cell">
                      <span className="font-body text-xs text-muted-foreground bg-muted px-2 py-0.5">
                        {w.category}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span className="font-display text-sm font-bold text-gold">
                        {formatINR(Number(w.price))}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          data-ocid={`admin.edit_button.${idx + 1}`}
                          variant="ghost"
                          size="sm"
                          onClick={() => openEdit(w)}
                          className="h-8 px-3 text-muted-foreground hover:text-foreground font-body gap-1.5"
                        >
                          <Pencil className="w-3.5 h-3.5" />
                          <span className="hidden sm:inline">Edit</span>
                        </Button>
                        <Button
                          data-ocid={`admin.delete_button.${idx + 1}`}
                          variant="ghost"
                          size="sm"
                          onClick={() => setDeleteId(w.id)}
                          className="h-8 px-3 text-muted-foreground hover:text-destructive font-body gap-1.5"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span className="hidden sm:inline">Delete</span>
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </main>

      {/* Add/Edit Watch Dialog */}
      <Dialog open={formOpen} onOpenChange={setFormOpen}>
        <DialogContent
          data-ocid="admin.dialog"
          className="bg-card border-border max-w-2xl max-h-[90vh] overflow-y-auto scrollbar-thin"
        >
          <DialogHeader>
            <DialogTitle className="font-display text-xl font-bold text-foreground">
              {editingId !== null ? "Edit Watch" : "Add New Watch"}
            </DialogTitle>
            <DialogDescription className="font-body text-sm text-muted-foreground">
              {editingId !== null
                ? "Update the watch details below."
                : "Fill in the details to add a new timepiece to your catalogue."}
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="font-body text-xs text-muted-foreground uppercase tracking-wider">
                  Name *
                </Label>
                <Input
                  data-ocid="admin.input"
                  value={form.name}
                  onChange={(e) => setField("name", e.target.value)}
                  placeholder="Aurel Noir"
                  className="bg-background border-border font-body"
                />
              </div>
              <div className="space-y-2">
                <Label className="font-body text-xs text-muted-foreground uppercase tracking-wider">
                  Brand *
                </Label>
                <Input
                  value={form.brand}
                  onChange={(e) => setField("brand", e.target.value)}
                  placeholder="Denseverse"
                  className="bg-background border-border font-body"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="font-body text-xs text-muted-foreground uppercase tracking-wider">
                  Category
                </Label>
                <Select
                  value={form.category}
                  onValueChange={(v) => setField("category", v)}
                >
                  <SelectTrigger
                    data-ocid="admin.select"
                    className="bg-background border-border font-body"
                  >
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-card border-border">
                    {(
                      [
                        "Dress",
                        "Sport",
                        "Dive",
                        "Chronograph",
                        "Vintage",
                      ] as Category[]
                    ).map((c) => (
                      <SelectItem key={c} value={c} className="font-body">
                        {c}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label className="font-body text-xs text-muted-foreground uppercase tracking-wider">
                  Price (₹) *
                </Label>
                <Input
                  type="number"
                  value={form.price}
                  onChange={(e) => setField("price", e.target.value)}
                  placeholder="29999"
                  className="bg-background border-border font-body"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label className="font-body text-xs text-muted-foreground uppercase tracking-wider">
                Image URL
              </Label>
              <Input
                value={form.image}
                onChange={(e) => setField("image", e.target.value)}
                placeholder="/assets/generated/watch-dress.dim_600x600.jpg"
                className="bg-background border-border font-body"
              />
            </div>

            <div className="space-y-2">
              <Label className="font-body text-xs text-muted-foreground uppercase tracking-wider">
                Description
              </Label>
              <Textarea
                data-ocid="admin.textarea"
                value={form.description}
                onChange={(e) => setField("description", e.target.value)}
                placeholder="Describe this timepiece…"
                rows={3}
                className="bg-background border-border font-body resize-none"
              />
            </div>

            <div className="border-t border-border pt-4">
              <p className="font-body text-xs text-muted-foreground uppercase tracking-wider mb-3">
                Specifications
              </p>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="font-body text-xs text-muted-foreground">
                    Case Size
                  </Label>
                  <Input
                    value={form.caseSize}
                    onChange={(e) => setField("caseSize", e.target.value)}
                    placeholder="40mm"
                    className="bg-background border-border font-body"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="font-body text-xs text-muted-foreground">
                    Material
                  </Label>
                  <Input
                    value={form.material}
                    onChange={(e) => setField("material", e.target.value)}
                    placeholder="316L Stainless Steel"
                    className="bg-background border-border font-body"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="font-body text-xs text-muted-foreground">
                    Water Resistance
                  </Label>
                  <Input
                    value={form.waterResistance}
                    onChange={(e) =>
                      setField("waterResistance", e.target.value)
                    }
                    placeholder="100m"
                    className="bg-background border-border font-body"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="font-body text-xs text-muted-foreground">
                    Movement
                  </Label>
                  <Input
                    value={form.movement}
                    onChange={(e) => setField("movement", e.target.value)}
                    placeholder="Swiss Quartz"
                    className="bg-background border-border font-body"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="font-body text-xs text-muted-foreground">
                    Crystal
                  </Label>
                  <Input
                    value={form.crystal}
                    onChange={(e) => setField("crystal", e.target.value)}
                    placeholder="Sapphire Crystal"
                    className="bg-background border-border font-body"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="font-body text-xs text-muted-foreground">
                    Strap
                  </Label>
                  <Input
                    value={form.strap}
                    onChange={(e) => setField("strap", e.target.value)}
                    placeholder="Italian Leather"
                    className="bg-background border-border font-body"
                  />
                </div>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button
              data-ocid="admin.cancel_button"
              variant="outline"
              onClick={() => setFormOpen(false)}
              className="font-body border-border"
            >
              Cancel
            </Button>
            <Button
              data-ocid="admin.save_button"
              onClick={handleSave}
              disabled={saving}
              className="gold-gradient text-primary-foreground font-body font-semibold border-0"
            >
              {saving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving…
                </>
              ) : editingId !== null ? (
                "Save Changes"
              ) : (
                "Add Watch"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirm Dialog */}
      <Dialog
        open={deleteId !== null}
        onOpenChange={(open) => !open && setDeleteId(null)}
      >
        <DialogContent
          data-ocid="admin.dialog"
          className="bg-card border-border max-w-sm"
        >
          <DialogHeader>
            <DialogTitle className="font-display text-lg font-bold text-foreground">
              Confirm Delete
            </DialogTitle>
            <DialogDescription className="font-body text-sm text-muted-foreground">
              This will permanently remove this watch from your catalogue. This
              action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="mt-2">
            <Button
              data-ocid="admin.cancel_button"
              variant="outline"
              onClick={() => setDeleteId(null)}
              className="font-body border-border"
            >
              Cancel
            </Button>
            <Button
              data-ocid="admin.confirm_button"
              onClick={handleDelete}
              disabled={deleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90 font-body border-0"
            >
              {deleting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Deleting…
                </>
              ) : (
                "Delete Watch"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
