import { useTagStore, useNoteStore } from "../../utils/zustandStore";
import makeAnimated from "react-select/animated";
import Select from "react-select/";
import styles from "./Home.module.css";
import { useNavigate } from "react-router";
import { NoteTagMapper } from "../../utils/regularFucntions";
import { useState } from "react";
import { note } from "../../utils/types";
import EditTags from "../editTags/EditTags";

export default function Home() {
  const navigate = useNavigate();
  const [edit, SetEdit] = useState<boolean>(false);
  const [tags] = useTagStore((state) => [state.tags]);
  const RawNotes = useNoteStore((state) => state.notes); // base notes from db with tag ids
  let baseNotes = NoteTagMapper(RawNotes, tags); /// base notes from db with tag values instead to ui rendering
  const [listOfNotes, filterNotes] =
    useState<{ id: string; note: note }[]>(baseNotes); // filtered notes
  return (
    <div className={styles.home}>
      {edit ? <EditTags SetAppearence={SetEdit} /> : null}
      <div className={styles.firstLayer}>
        <h2>Noteable</h2>
        <div>
          <button
            onClick={() => {
              navigate("/new");
            }}
          >
            New Note
          </button>
          <button onClick={() => SetEdit(true)}>Edit Tags</button>
        </div>
      </div>
      <div>
        <div className={styles.filterLayer}>
          <div className={styles.titleFilter}>
            <h3>Filter the notes by title</h3>
            <input
              type="text"
              onChange={(e) => {
                const newNotes = baseNotes.filter((el) => {
                  return el.note.title.includes(e.target.value, 0);
                });
                filterNotes(newNotes);
              }}
            />
          </div>
          <div className={styles.tagFilter}>
            <h3>Filter the notes by tags</h3>
            <Select
              styles={{
                control: (baseStyles, state) => ({
                  ...baseStyles,
                  borderRadius: "15px",
                  height: "2.5rem",
                }),

                container: (baseStyles, state) => ({
                  ...baseStyles,
                  width: "80%",
                }),
              }}
              options={(() => {
                let options = [];
                for (let [value, label] of tags.entries()) {
                  options.push({ label, value });
                }
                return options;
              })()}
              onChange={(Tags) => {
                const newNotes = baseNotes.filter((el) => {
                  let valid = true;
                  for (let val of Tags) {
                    const newVal = val as { label: string; value: string };
                    if (!el.note.tags.includes(newVal.label)) valid = false;
                  }
                  return valid;
                });
                filterNotes(newNotes);
              }}
              components={makeAnimated()}
              isMulti
            />
          </div>
        </div>
        <div className={styles.notesLayer}>
          {listOfNotes.map((note) => (
            <div
              key={note.id}
              className={styles.note}
              data-id={note.id}
              onClick={() => navigate(`/note/${note.id}`)}
            >
              <img
                src={`/api/static/imgs/${note.note.ImagePath}`}
                style={{
                  display: `${note.note.ImagePath === "" ? "none" : "block"}`,
                }}
              />
              <div className={styles.title}>{note.note.title}</div>
              <div className={styles.tags}>
                {note.note.tags.map((tag, idx) => {
                  if (idx < 5) {
                    return (
                      <span key={tag + idx} className={styles.tag}>
                        {tag}
                      </span>
                    );
                  }
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
