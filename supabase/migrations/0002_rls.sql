alter table cookies enable row level security;
alter table email_signups enable row level security;

create policy "Anyone can view Cookies"
  on cookies for select
  to anon
  using (true);

create policy "Anyone can submit a Cookie"
  on cookies for insert
  to anon
  with check (true);

create policy "Anyone can submit an Email Signup"
  on email_signups for insert
  to anon
  with check (true);
